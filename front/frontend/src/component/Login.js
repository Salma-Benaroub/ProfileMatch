import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Cssfiles/Login.css';
import Navbar from './Navbar/Navbar';
import img from '../Asserts/login.jpg'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        email: email,
        password: password,
      });
  
      if (response.data && response.data.message === 'Connexion réussie') {
        const user_id = response.data.user_id;
        sessionStorage.setItem('user_id', user_id);

        // Vérifier si l'utilisateur a déjà rempli le formulaire
        const formulaireResponse = await axios.get(`http://localhost:5001/api/checkformulaire/${user_id}`);

        if (formulaireResponse.data && formulaireResponse.data.filled) {
          // Rediriger vers PageRh si le formulaire est déjà rempli
          navigate('/PageRh');
        } else {
          // Rediriger vers le formulaire s'il n'est pas encore rempli
          navigate('/Formulaire');
        }
      } else {
        throw new Error('Adresse email ou mot de passe incorrect');
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Une erreur est survenue';
      setErrorMessage(message);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-image"> 
            <img src={img} alt="Description de l'image" />
          </div>
        <div className="login-form">
          <h2>Connexion</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label htmlFor="password">Mot de passe </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit">Se connecter</button>
            <div className="signup-link">
              <p>Vous n'avez pas de compte ? <Link to="/SignupForm">S'inscrire</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;