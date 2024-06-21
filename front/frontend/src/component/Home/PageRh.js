import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import './PageRh.css';
import logoo from '../../Asserts/rh.png';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const PageRh = () => {
    const [searchValue, setSearchValue] = useState('');
    const [recommendedCvs, setRecommendedCvs] = useState([]);
    const [searchedCvs, setSearchedCvs] = useState([]); // Nouvel état pour les résultats de recherche
    const [loading, setLoading] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const userId = sessionStorage.getItem('user_id');
    console.log(userId);

    useEffect(() => {
        const fetchRecommendedCvs = async () => {
            if (userId) {
                try {
                    const recommendationResponse = await axios.get(`http://localhost:5003/recommend?user_id=${userId}`);
                    const recommendedCvIds = recommendationResponse.data.recommended_cvs;

                    const cvPromises = recommendedCvIds.map(async (cvId) => {
                        const cvResponse = await axios.get(`http://localhost:5002/get_cv/${cvId}`, {
                            responseType: 'blob'
                        });
                        const pdfUrl = URL.createObjectURL(cvResponse.data);
                        return { cv_id: cvId, pdfUrl };
                    });

                    const resolvedCvs = await Promise.all(cvPromises);
                    setRecommendedCvs(resolvedCvs);
                } catch (error) {
                    console.error('Une erreur s\'est produite lors de la récupération des CV recommandés :', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRecommendedCvs();
    }, [userId]);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearchClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5002/search?q=${searchValue}`);
            const cvResults = response.data;

            const cvPromises = cvResults.map(async (cv) => {
                const cvResponse = await axios.get(`http://localhost:5002/get_cv/${cv.cv_id}`, {
                    responseType: 'blob'
                });

                const pdfUrl = URL.createObjectURL(cvResponse.data);
                return { ...cv, pdfUrl };
            });

            const resolvedCvs = await Promise.all(cvPromises);
            setSearchedCvs(resolvedCvs); // Stocker les résultats de recherche
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la recherche de CV :', error);
            setSearchedCvs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeClick = async (cvId) => {
        try {
            await axios.post('http://localhost:5003/interact', {
                user_id: userId,
                cv_id: cvId,
                interaction_type: 'like'
            });
            alert('CV liked successfully!');
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la mise à jour de l\'interaction :', error);
        }
    };

    const handleRatingChange = async (cvId, rating) => {
        try {
            await axios.post('http://localhost:5003/interact', {
                user_id: userId,
                cv_id: cvId,
                interaction_type: 'rating_' + rating
            });

            alert('Rating recorded successfully!');
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la mise à jour de l\'interaction :', error);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true, // Enable auto play
        autoplaySpeed: 3000, // Set auto play speed (in milliseconds)
    };

    return (
        <>
        <Navbar/>
        <div className='pagerh'>
            <div className="page-rh-container">
            <h2 class="search-results-heading">Discover an exclusive selection of <br></br>profiles that could match <span style={{ color: '#5fb300' }}>Your needs.</span></h2>
                <div className="recommended-cvs-container">
                <div className="content-with-image">
                <div className="content-container">
                <div className="text-container">
                <h3>
    Discover our handpicked selection of resumes, 
    meticulously chosen to cater to your unique job search journey. 
    Uncover a wealth of skills and experiences showcased by our diverse pool of candidates.Take the opportunity to engage with them <br />
    whether it's by liking whether it's by liking their profiles or offering 
    Your interaction helps us tailor your job search experience even further. 
    </h3>

                </div>
                <div className="image-container">
                <img src={logoo} alt="Logo" />
                </div>
</div>


    </div>
    
                    <br></br>
                    <Slider {...settings}>
                        {recommendedCvs.map((cv, index) => (
                            <div key={index} className="cv-card">
                                <embed src={cv.pdfUrl} type="application/pdf" width="100%" height="500px" />
                                <div className="interaction-container">
                                    <button onClick={() => window.open(cv.pdfUrl)} className="view-button">Show</button>
                                    <button onClick={() => handleLikeClick(cv.cv_id)} className="like-button">Like   </button>
                                    <div className="rating-container">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <span
                                                key={rating}
                                                onClick={() => handleRatingChange(cv.cv_id, rating)}
                                                className={`star ${selectedRating === rating ? 'selected' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    {recommendedCvs.length === 0 && !loading && (
                        <div className="no-results">Aucun résultat trouvé pour cette recherche.</div>
                    )}
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Recherchez un CV..."
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearchClick}>search</button>
                    
                </div>
                {loading && <div className="loader">Chargement...</div>}
                
                <div className="searched-cvs-container">
                    <h2 class="search-results-heading">Voici les résultats de <span style={{ color: '#5fb300' }}>Votre recherche .</span></h2>
                    <div class="text-container">
                    <h3> Explorez les profils ci-dessous pour trouver des candidats correspondant à vos critères. Chaque CV offre un aperçu détaillé des compétences et des expériences du candidat. N'hésitez pas à interagir avec les CV en utilisant les boutons disponibles pour enregistrer vos favoris ou attribuer une note.</h3>
                    </div>
                    <br></br>
                    <Slider {...settings}>
                        {searchedCvs.map((cv, index) => (
                            <div key={index} className="cv-card">
                                <embed src={cv.pdfUrl} type="application/pdf" width="100%" height="500px" />
                                <div className="interaction-container">
                                    <button onClick={() => window.open(cv.pdfUrl)} className="view-button">Voir</button>
                                    <button onClick={() => handleLikeClick(cv.cv_id)} className="like-button">Like</button>
                                    <div className="rating-container">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <span
                                                key={rating}
                                                onClick={() => handleRatingChange(cv.cv_id, rating)}
                                                className={`star ${selectedRating === rating ? 'selected' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    {searchedCvs.length === 0 && !loading && (
                        <div className="no-results">Aucun résultat trouvé pour cette recherche.</div>
                    )}
                </div>
                <br></br>
                <br></br>
            </div>
        </div>
       
        <Footer/>
        </>    
    );
};

export default PageRh;
