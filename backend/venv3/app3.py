from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime
from flask_cors import CORS
from gridfs import GridFS
app = Flask(__name__)
CORS(app, supports_credentials=True)
# Connexion à MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['cv']
fs = GridFS(db)
historique_collection = db['historique']
cv_collection = db['cv_details']
interactions_collection = db['user_interaction']

def get_historique_data():
    return list(historique_collection.find({}))

def get_cv_data():
    return list(cv_collection.find({}))

#récupèrer toutes les interactions passées de l'utilisateur spécifié avec les CV. 
def get_user_interactions(user_id):
   return list(interactions_collection.find({'user_id': user_id}))

def get_all_user_interactions():
    return list(interactions_collection.find({}))


def create_user_profile(user_keywords, vectorizer):
    user_vector = np.zeros((1, len(vectorizer.get_feature_names_out())))
    if user_keywords:
        keyword_vector = vectorizer.transform(user_keywords)
        user_vector += keyword_vector.toarray().sum(axis=0)
    return user_vector / len(user_keywords) if user_keywords else user_vector

def recommend_cvs(user_id, user_profiles, cv_vectors, cv_ids, top_n=5):
    user_vector = user_profiles[user_id]
    similarities = cosine_similarity(user_vector, cv_vectors)
    similar_indices = similarities.argsort()[0][-top_n:][::-1]
    recommended_cvs = [cv_ids[idx] for idx in similar_indices]
    return recommended_cvs

def recommend_cvs_collaborative(user_id, cv_id, top_n=5):
    all_interactions = get_all_user_interactions()
    user_interactions = get_user_interactions(user_id)
    
    if not all_interactions:
        return []
    
    interaction_weights = {
        "like": 5,
        "rating_1": 1,
        "rating_2": 2,
        "rating_3": 3,
        "rating_4": 4,
        "rating_5": 5
    }
    
    interaction_counts = {}
    for interaction in all_interactions:
        cv_id = str(interaction['cv_id'])
        weight = interaction_weights.get(interaction['interaction_type'], 1)
        
        if cv_id in interaction_counts:
            interaction_counts[cv_id] += weight
        else:
            interaction_counts[cv_id] = weight
    
    for interaction in user_interactions:
        cv_id = str(interaction['cv_id'])
        weight = interaction_weights.get(interaction['interaction_type'], 1) * 2  # Double the weight for the user's interactions
        
        if cv_id in interaction_counts:
            interaction_counts[cv_id] += weight
        else:
            interaction_counts[cv_id] = weight
    
    # Trier les interactions par score
    sorted_interactions = sorted(interaction_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Sélectionner les recommandations uniques tout en conservant l'ordre de priorité
    unique_recommendations = []
    seen_cv_ids = set()
    for cv_id, count in sorted_interactions:
        if cv_id not in seen_cv_ids:
            unique_recommendations.append((cv_id, count))
            seen_cv_ids.add(cv_id)
        if len(unique_recommendations) == top_n:
            break
    
    return unique_recommendations

@app.route('/recommend', methods=['GET'])
def recommend():
    # Récupérer l'ID de l'utilisateur à partir des paramètres de la requête.
    user_id = request.args.get('user_id')
    print("User ID:", user_id)
    
    # Vérifier si l'ID de l'utilisateur est manquant
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Récupère les données d'historique associées à l'utilisateur.
    historique_data = get_historique_data()
    print("Historique data:", historique_data)
    
    # Vérifier si aucune donnée d'historique n'a été trouvée pour l'utilisateur 
    if not historique_data:
        return jsonify({"error": "No historique data found"}), 404

    # Initialise une liste pour stocker les mots-clés recherchés par l'utilisateur.
    user_keywords = []
    
    # Parcourt les données d'historique pour extraire les mots-clés de l'utilisateur spécifié.
    for entry in historique_data:
        # Vérifie si l'entrée d'historique correspond à l'ID de l'utilisateur.
        if str(entry['user_id']) == user_id:
            # Ajoute le mot-clé à la liste s'il est trouvé dans les données d'historique.
            user_keywords.append(entry.get('description', ''))

    # Vérifie si aucun mot-clé n'a été trouvé dans l'historique pour l'utilisateur, auquel cas une erreur est renvoyée.
    if not user_keywords:
        return jsonify({"error": "No keywords found in historique data for this user"}), 404

    print("User keywords:", user_keywords)
    
    # Crée un profil utilisateur en concaténant tous les mots-clés trouvés dans l'historique.
    user_profile = ' '.join(user_keywords)
    print("User profile:", user_profile)
    
    # Initialise un vectoriseur TF-IDF pour convertir le profil utilisateur et les CV en vecteurs numériques.
    vectorizer = TfidfVectorizer()
    
    # Ajuste le vectoriseur aux données du profil utilisateur.
    vectorizer.fit([user_profile])
    
    # Crée un profil utilisateur à partir des mots-clés trouvés et du vectoriseur.
    user_profiles = {user_id: create_user_profile(user_keywords, vectorizer)}
    print("User profiles:", user_profiles)

    # Récupère les données des CV.
    cv_data = get_cv_data()
    
    # Vérifie si aucune donnée de CV n'a été trouvée auquel cas une erreur est renvoyée.
    if not cv_data:
        return jsonify({"error": "No CV data found"}), 404

    # Extrait les textes des CV et les identifiants des CV.
    cv_texts = [cv.get('cv_text', '') for cv in cv_data]
    cv_ids = [str(cv['cv_id']) for cv in cv_data]
    
    # Transforme les textes des CV en vecteurs numériques à l'aide du vectoriseur TF-IDF.
    cv_vectors = vectorizer.transform(cv_texts)
    
    # Appelle la fonction de recommandation de contenu pour recommander des CV basés sur le profil utilisateur.
    recommended_cvs_content = recommend_cvs(user_id, user_profiles, cv_vectors, cv_ids)
    
    # Appelle la fonction de recommandation collaborative pour recommander des CV basés sur les interactions passées de l'utilisateur.
    recommended_cvs_collaborative = recommend_cvs_collaborative(user_id, cv_ids)

    # Combine les recommandations de contenu et de collaboration, sélectionne les 5 premières recommandations uniques.
    combined_recommendations = []
    seen_ids = set()  # Utilisation d'un ensemble pour suivre les IDs déjà vus.

    for recommendation in recommended_cvs_content:
        if recommendation not in seen_ids:
            seen_ids.add(recommendation)
            combined_recommendations.append(recommendation)
            if len(combined_recommendations) == 5:
                break

    for recommendation in recommended_cvs_collaborative:
        recommendation_id = recommendation[0]  # assuming recommendation is a tuple (cv_id, score)
        if recommendation_id not in seen_ids:
            seen_ids.add(recommendation_id)
            combined_recommendations.append(recommendation_id)
            if len(combined_recommendations) == 5:
                break

    # Renvoie une réponse JSON contenant l'ID de l'utilisateur et les CV recommandés.
    return jsonify({"user_id": user_id, "recommended_cvs": combined_recommendations})



@app.route('/interact', methods=['POST'])
def interact():
    # Récupère les données JSON de la requête.
    data = request.json
    # Récupère l'ID de l'utilisateur, l'ID du CV et le type d'interaction à partir des données JSON.
    user_id = data.get('user_id')
    cv_id = data.get('cv_id')
    interaction_type = data.get('interaction_type')

    # Vérifie si l'un des éléments nécessaires est manquant dans les données JSON, auquel cas une erreur est renvoyée.
    if not user_id or not cv_id or not interaction_type:
        return jsonify({"error": "User ID, CV ID, and interaction type are required"}), 400

    # Crée un objet représentant l'interaction, y compris l'ID de l'utilisateur, l'ID du CV, le type d'interaction et un horodatage.
    interaction = {
        "user_id": user_id,
        "cv_id": cv_id,
        "interaction_type": interaction_type,
        "timestamp": datetime.utcnow()
    }

    # Insère l'interaction dans la collection des interactions dans la base de données.
    interactions_collection.insert_one(interaction)
    # Renvoie un message JSON indiquant que l'interaction a été enregistrée avec succès, avec le code de statut HTTP 201 (créé).
    return jsonify({"message": "Interaction recorded"}), 201

if __name__ == '__main__':
    app.run(port=5003, debug=True)