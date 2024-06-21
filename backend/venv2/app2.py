import re
from flask import Flask, request, jsonify, send_file
import pymongo
import fitz  # PyMuPDF
import io
from bson import ObjectId
from flask_cors import CORS
from gridfs import GridFS
import nltk
from nltk.corpus import stopwords
from pyspark.ml.feature import Tokenizer, StopWordsRemover, HashingTF, IDF
from pyspark.sql import SparkSession

# Télécharger les stopwords français
nltk.download('stopwords')
stop_words = set(stopwords.words('french'))

# Fonction de nettoyage du texte, incluant les caractères accentués et suppression des stop words
def clean_text(text):
    # Supprimer les caractères non alphabétiques et les espaces, mais conserver les lettres accentuées
    cleaned_text = re.sub(r'[^a-zA-ZÀ-ÿ\s]', '', text, flags=re.UNICODE)
    # Convertir en minuscules
    cleaned_text = cleaned_text.lower()
    # Supprimer les espaces supplémentaires
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    # Supprimer les stop words
    tokens = cleaned_text.split()
    filtered_text = ' '.join([word for word in tokens if word not in stop_words])
    return filtered_text

def extract_text_from_pdf(pdf_data):
    try:
        pdf_document = fitz.open(stream=pdf_data, filetype="pdf")
        extracted_text = ""
        for page in pdf_document:
            extracted_text += page.get_text()
        cleaned_text = clean_text(extracted_text)  # Nettoyer le texte extrait
        return cleaned_text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""

# Initialisation de la session Spark
spark = SparkSession.builder \
    .appName("CV Data Processing") \
    .config("spark.mongodb.input.uri", "mongodb://localhost:27017/cv.cv_details") \
    .config("spark.mongodb.output.uri", "mongodb://localhost:27017/cv.cv_details") \
    .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .getOrCreate()

# Load CVs from MongoDB
df = spark.read.format("mongo").load()
#df.show()

app2 = Flask(__name__)
CORS(app2)

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["cv"]
fs = GridFS(db)

dbs = client['cv']
cv_collections = dbs['historique']

# Tokenize the cleaned text
tokenizer = Tokenizer(inputCol="cv_text", outputCol="words")
words_data = tokenizer.transform(df)

# Remove stopwords
remover = StopWordsRemover(inputCol="words", outputCol="filtered_words")
filtered_data = remover.transform(words_data)

# Apply TF
hashing_tf = HashingTF(inputCol="filtered_words", outputCol="raw_features", numFeatures=20000)
featurized_data = hashing_tf.transform(filtered_data)

# Apply IDF
idf = IDF(inputCol="raw_features", outputCol="features")
idf_model = idf.fit(featurized_data)
tfidf_data = idf_model.transform(featurized_data)
tfidf_data.show()

@app2.route('/api/submit_cv', methods=['POST'])
def submit_cv():
    try:
        if 'cv_file' not in request.files:
            return 'No PDF file was submitted', 400
        
        cv_file = request.files['cv_file']
        
        # Lire le contenu du fichier PDF
        pdf_data = cv_file.read()

        # Extraire le texte du PDF
        extracted_text = extract_text_from_pdf(pdf_data)

        # Insérer le fichier PDF et le texte extrait dans MongoDB via GridFS
        cv_id = fs.put(pdf_data, filename=cv_file.filename)
        
        # Stocker les détails du CV dans une collection séparée
        cv_details = {
            'cv_id': cv_id,
            'cv_text': extracted_text
        }
        db.cv_details.insert_one(cv_details)
        
        return jsonify({'message': 'CV submitted', 'cv_id': str(cv_id)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app2.route('/get_all_cvs', methods=['GET'])
def get_all_cvs():
    try:
        all_cvs = []
        # Parcourir tous les CV dans la collection et les ajouter à la liste
        for cv in db.cv_details.find():
            all_cvs.append({
                'cv_id': str(cv['cv_id']),
                'cv_text': cv['cv_text']
            })
        return jsonify(all_cvs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app2.route('/search', methods=['GET'])
def search_cv():
    query = request.args.get('q')

    if not query:
        return 'Please provide a search term', 400

    results = []
    # Find CVs based on the search term in their extracted text
    for cv in db.cv_details.find({'cv_text': {'$regex': query, '$options': 'i'}}):
        results.append({
            'cv_id': str(cv['cv_id']),
            'cv_text': cv['cv_text']
        })

    if not results:
        return 'No matching CV found', 404

    # Enregistrer l'interaction dans la base de données
    user_id = 4
    if user_id:
        cv_ids = [cv['cv_id'] for cv in results]
        interaction_data = {
            'user_id': user_id,
            'cv_ids': cv_ids,
            'description': query  
        }
        cv_collections.insert_one(interaction_data)
    return jsonify(results), 200

@app2.route('/get_cv/<cv_id>', methods=['GET'])
def get_cv(cv_id):
    try:
        # Retrieve CV file from GridFS based on the provided cv_id
        cv_file = fs.get(ObjectId(cv_id))

        # Check if the retrieved file exists
        if cv_file is None:
            return f'CV not found with ID: {cv_id}', 404

        # Create a BytesIO object to read the content of the file
        cv_content = io.BytesIO(cv_file.read())

        # Create a response with the PDF data
        response = send_file(cv_content, mimetype='application/pdf')
        response.headers['Content-Disposition'] = f'inline; filename=cv_{cv_id}.pdf'
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
if __name__ == '__main__':
    app2.run(port=5002, debug=True)
