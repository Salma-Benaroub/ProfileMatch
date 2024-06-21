import React from 'react'
import './main.css'
import '../Home/FileUpload'
import { LuSendHorizonal } from "react-icons/lu";
import 'boxicons/css/boxicons.min.css';

//import icons
import { HiOutlineInformationCircle,HiOutlineLocationMarker } from "react-icons/hi";

// import images
import img from '../../Asserts/maroc.png'
import img1 from '../../Asserts/ooo.png' 
import img2 from '../../Asserts/ss.jpg'
import img3 from '../../Asserts/img1.jpeg'
import img4 from '../../Asserts/li1.jpeg'
import img5 from '../../Asserts/li2.jpeg'
import img6 from '../../Asserts/rj.png'


const Data = [
  {"id":1,
  "imgScr": img,
  "name":"IAM company",
  "local":"Casablanca, Near Shore, Shore 14, 2nd Floor",
  "email":"aleadbeatter0@opera.com",
  "tele":"+86 299 565 1567",
  "Linkedin":"http://discuz.net",
  "Description":"IAM is the principal telecommunications provider in Morocco. Over the years, the company has grown to become a leading player in the telecommunications industry,in several other African countries.",
},
  {"id":2,
  "imgScr": img2,
  "name":" SocGen company",
  "local":"Casablanca, Near Shore, Shore 14, 2nd Floor",
  "email":"aleadbeatter0@opera.com",
  "tele":"+86 299 565 1567",
  "Linkedin":"http://discuz.net",
  "Description":"Société Générale is a large bank operating on a global scale, known for its expertise and innovative financial solutions, les logiciels d'entreprise et les services IT.",},
  {"id":3,
  "imgScr": img1,
  "name":"OCP company",
  "local":"Khouribga Avanue Hassan II- Hay Orir 12",
  "email":"aleadbeatter0@opera.com",
  "tele":"+86 299 565 1567",
  "Linkedin":"http://discuz.net",
  "Description":"OCP is a key site for phosphate mining in Morocco, , les logiciels d'entreprise et les services cloud.It is a crucial element of the Moroccan mining industry, et les services AI."}
 ]

function Main() {
  return (
    <>
    <section className='main container section' id='companies'>
        <div className="secTitle" >
            <h3 className='title'>Some collaborated companies</h3>
        </div>
        <div className="secContent grid">
            {Data.map(({id,imgScr,name,local,Description,Langue})=>{
                return (
                <div key={id} className="singleCondidate">

                      <div className="imgDiv">
                       <img  src={imgScr} alt={name}/>
                      </div>
                      <div className="cardInfo">
                        <h4 className='destName'>{name}</h4>
                        <span className="continent flex">
                          <HiOutlineLocationMarker className='icon'/> 
                              <span className="local"> {local}</span>
                        </span>
                     </div>
                  <div className='desc'>
                          <span>{Description}</span>
                  </div>
                    <button className='btn flex'>
                      Visit site  <HiOutlineInformationCircle className='icon'/>
                    </button>
                </div>
               )})} 
           </div>  
    </section>

    <div>
    <section className="about container section" id="about">
    <div className="secTitle2" >
        <h3 className='title2'>The purpose of this platform</h3>
    </div>
    <div className="about-container">
      <div className="about-img">
        <img src={img6} alt="Internship" />
      </div>
      <div className="about-text">
        <span>About us</span>
         <p><b>RecomProfil</b> is an innovative platform designed to facilitate connections between candidates and human resources. Our platform allows candidates to easily submit their resumes, while HR professionals can search for relevant profiles based on their specific needs.
            We are committed to providing a seamless and efficient experience for both candidates and companies. </p>
        <p>Through our collaborations with major corporations, we are able to connect top talent with the most promising career opportunities.
        Whether you're seeking a new job or looking to find the ideal candidates for your company, RecomProfil is your trusted partner in the recruitment process.</p>
          
        <a href="#cv" className="btn">Submit your CV</a>
      </div>
    </div>
  </section>
  
  <section className="reviews container section" id="reviews">
     <div className="secTitle3" >
        <h3 className="title3">Experiences of our users</h3>
      </div>
      <div className="reviews-container">
        <div className="box">
          <div className="rev-img">
            <img src={img3} alt="client" />
          </div>
          <h2>Salim Barkaoui</h2>
          <div className="stars">
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
          </div>
          <p>Thanks to RecomProfil, I landed my dream job in a leading tech company. The platform made it easy for me to showcase my skills and experience to potential employers, and I received multiple job offers within a short period. I'm grateful for the seamless experience and the opportunity to advance my career.</p>
        </div>

        <div className="box">
          <div className="rev-img">
            <img src={img5} alt="client" />
          </div>
          <h2>Manal Hilali</h2>
          <div className="stars">
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
          </div>
          <p>RecomProfil played a crucial role in my job search journey. As a recent graduate, I was struggling to find employment in my field. However, after creating my profile and uploading my resume on the platform, I received interview invitations from several reputable companies. Eventually, I secured a position that aligned perfectly with my career goals.</p>
        </div>

        <div className="box">
          <div className="rev-img">
            <img src={img4} alt="client" />
          </div>
          <h2>Saad Miftah</h2>
          <div className="stars">
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
          </div>
          <p>RecomProfil exceeded my expectations in every way possible. After months of job hunting with little success, I decided to give the platform a try. Within days of creating my profile, I received personalized job recommendations tailored to my skills and preferences. The application process was seamless, and I appreciated the platform's transparency throughout. </p>
        </div>
      </div>
    </section>

    <section id="contact" className="section-contact container section">

    <div className="secTitle4" >
        <h3 className="title4">If you have any questions</h3>
      </div>
      <form >
        <div className="form-nom-email">
          <div className="form-column">
            <label htmlFor="nom"><b>Nom</b></label>
            <input
              type="text"
              name="nom"
              id="nom"
            />
          </div>
          <div className="form-column">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              name="email"
              id="email"
            />
          </div>
        </div>
        <label htmlFor="message"><b>Message</b></label>
        <textarea
          name="message"
          id="message"
          rows="10"
        />
        <a href="#contact" className="btn1">Send</a>
      </form>
    
    </section>

</div>

</>
  )
}

export default Main
