import React, {useEffect} from 'react';
import './home.css';
import video from '../../Asserts/vi2.mp4';
import { FiFacebook } from 'react-icons/fi';
import { AiOutlineInstagram } from 'react-icons/ai';
import { BsListTask} from 'react-icons/bs';
import { TbApps } from 'react-icons/tb';

import Aos from 'aos'
import 'aos/dist/aos.css'

import FileUpload from './FileUpload';

function Home() {
  // animations 
  useEffect(()=>{
    Aos.init({duration:2000})
  })

  return (
    <section className='home'>
      <div className="overlay"></div>
      <video src={video} muted autoPlay loop type="video/mp4" />
      <div className="homeContent container">
        <div className="textDiv">
          <h1 data-aos='fade-up' className='homeTitle'>Explore your opportunities...</h1>
          <p   className='description'>
              Discover countless career opportunities tailored to your skills and ambitions. 
              Find your next job with us and take your career to new heights!
          </p>
        </div>

        <div className="cardDiv grid" id="cv">
          <FileUpload />
        </div>

        <div className="homeFooterIcon flex">
          <div className="rightIcons">
            <FiFacebook className='icon' />
            <AiOutlineInstagram className='icon' />
          </div>
          <div className="leftIcons">
              <BsListTask className='icon'/>
              <TbApps className='icon'/>
            </div>        
        </div>
      </div>
     
    </section>
  );
}

export default Home;
