import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './Navbar/Navbar';
import img from '../Asserts/regis.jpg';
import './Cssfiles/SignupForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    sexe: '',
    telephone: '',
    ville: ''
  });

  const [successMessage, setSuccessMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Réinitialise le message de succès
    setErrorMessage(''); // Réinitialise le message d'erreur
    try {
      const response = await axios.post('http://localhost:5001/api/register', formData);
      console.log(response.data);

      // Message de succès si l'inscription réussit
      setSuccessMessage('Inscription réussie!');

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        sexe: '',
        telephone: '',
        ville: ''
      });
    } catch (error) {
      // Afficher un message d'erreur si quelque chose ne va pas
      setErrorMessage("Veuillez remplir tout les champs ! ");
    }
  };

  return (
    <>
      <NavBar />
      <div className="register-container">
        <div className="register-image"> 
          <img src={img} alt="Description de l'image" />
        </div>
        <div className="register-form">
          <h2>Register</h2>

          {/* Afficher les messages de succès et d'erreur */}
          {successMessage && <div className="success-message">{successMessage}</div>} 
          {errorMessage && <div className="error-message">{errorMessage}</div>} 

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} />

              <label htmlFor="prenom">Prénom</label>
              <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
              
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
              
              <label htmlFor="sexe">Sexe</label>
              <select id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} className="form-element select">
                <option value="">Choisissez...</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                
              </select>
              
              <label htmlFor="telephone">Téléphone</label>
              <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
              
              <label htmlFor="ville">Ville</label>
              <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleChange} />
            </div>
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
