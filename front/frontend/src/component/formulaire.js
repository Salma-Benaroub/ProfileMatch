import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Cssfiles/formulaire.css'
import Navbar from './Navbar/Navbar';

const SignupSchema = Yup.object().shape({
    entreprise: Yup.string().required('Required'),
    specialite: Yup.string().required('Required'),
    motcle: Yup.string().required('Required'),
});

const Formulaire = () => {
    const navigate = useNavigate(); // Access the useNavigate hook

    const userid = sessionStorage.getItem('user_id');
    console.log(userid);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axios.post(`http://localhost:5001/api/insertformulaire/${userid}`, values, {
                withCredentials: true
            });

            console.log(response.data);
            resetForm();
            
            // Redirect to the desired page after successful form submission
            navigate('/PageRh'); // Specify the path to navigate to
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    };

    return (
        <>
    
    <Navbar/>
    <div className='form-container' > 
        <Formik
            initialValues={{
                entreprise: '',
                specialite: '',
                motcle: ''
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}>
            {formik => (
                <Form className="form-form">
                    <h2>Formulaire</h2>
                    <label htmlFor="entreprise">Entreprise</label>
                    <Field name="entreprise" type="text" />
                    <label htmlFor="specialite">Spécialité</label>
                    <Field name="specialite" type="text" />
                    <label htmlFor="motcle">Mot-clé</label>
                    <Field name="motcle" type="text" />
                    <button type="submit">{formik.isSubmitting ? 'Chargement...' : 'Enregistrer'}</button>
                </Form>
            )}
        
        </Formik>
        
    </div>
        </>
    );
};

export default Formulaire;