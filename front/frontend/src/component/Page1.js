import React from 'react'
import './Cssfiles/Page1.css';
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import Main from './Main/Main'
import Footer from './Footer/Footer'

const Page1 = () => {
  return (
    <>
    <Navbar/>
    <Home/>
    <Main/>
    <Footer/>
    </>
  )
}

export default Page1