from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask import session
from os import urandom
import logging
from datetime import timedelta

# Configurer le niveau de journalisation pour afficher tous les messages de niveau INFO et supérieurs
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
CORS(app, supports_credentials=True)
app.secret_key = urandom(24)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = "d@taengineer2001"
app.config['MYSQL_DB'] = 'nassima'

mysql = MySQL(app)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Adresse email ou mot de passe manquant'}), 400  # Code d'erreur 400 pour une mauvaise demande

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, email, password FROM users WHERE email = %s AND password = %s", (email, password))
    user = cur.fetchone()
    cur.close()

    if user:
       # L'utilisateur est trouvé dans la base de données, connexion réussie
        user_id = user[0] 
        session['user_id'] = user_id  # Stocke l'ID de l'utilisateur dans la session
        logging.info('Connexion réussie pour l\'utilisateur avec ID : %s', user_id)
        return jsonify({'message': 'Connexion réussie', 'user_id': user_id})
    else:
        # L'utilisateur n'est pas trouvé dans la base de données, connexion échouée
        return jsonify({'error': 'Adresse email ou mot de passe incorrect'}), 401  # Code d'erreur 401 pour une authentification échouée


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')
    password = data.get('password')
    sexe = data.get('sexe')
    telephone = data.get('telephone')
    ville = data.get('ville')

    if not nom or not prenom or not email or not password or not sexe or not telephone or not ville:
        return jsonify({'error': 'Tous les champs doivent être remplis'}), 400

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO users (nom, prenom, email, password, sexe, telephone, ville) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (nom, prenom, email, password, sexe, telephone, ville))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Utilisateur enregistré avec succès'})


@app.route('/api/insertformulaire/<int:post_id>', methods=['POST'])
def insert_formulaire(post_id):
    print(post_id)
    if request.method == 'POST':
        data=request.json
        print("Data received:", data)
        entreprise =data.get('entreprise')
        specialite =data.get('specialite')
        motcle =data.get('motcle')
        
        # Récupérer l'ID de l'utilisateur à partir de la session
        user_id = post_id

        if user_id:
            # Exécuter la requête SQL pour insérer les données dans la table formulaire
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO formulaire(entreprise,specialite,motcle,user_id) VALUES (%s, %s, %s,%s)",
                        (entreprise, specialite, motcle,user_id))
            mysql.connection.commit()
            cur.close()

            return jsonify({'message': 'Données du formulaire insérées avec succès'}), 200
        else:
            return jsonify({'error': 'ID utilisateur non trouvé dans la session'}), 400


@app.route('/api/checkformulaire/<int:user_id>', methods=['GET'])
def check_formulaire(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM formulaire WHERE user_id = %s", (user_id,))
    existing_form_data = cur.fetchone()
    cur.close()

    if existing_form_data:
        return jsonify({'filled': True}), 200
    else:
        return jsonify({'filled': False}), 200


if __name__ == '__main__':
    app.run(port=5001)