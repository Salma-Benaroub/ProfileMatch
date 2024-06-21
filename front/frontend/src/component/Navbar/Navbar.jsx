import React, {useState} from 'react'
import './navbar.css'
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";

function Navbar() {
    const [active, setActive]= useState('navBar')

    const showNav= ()=>{
      setActive('navBar activeNavbar')
    }

    const removeNavbar= ()=>{
      setActive('navBar')
    }

  return (
    <section className='navBarSection'>
      <header className='header flex'>

        <div className='logoDiv'>
          <a href='/Page1' className='logo flex'>
            <h1><FaChalkboardTeacher className='icon'/>RecomProfil.</h1>
          </a>
        </div>

        <div className={active}>
          <ul className='navLists flex'>

            <li className='navItem'>
              <a href= "/" className='navLink'>Home</a>
            </li>

            <li className='navItem'>
              <a href= "#companies" className='navLink'>All companies</a>
            </li>

            <li className='navItem'>
              <a href= "#about" className='navLink'>About</a>
            </li>
            <li className='navItem'>
              <a href= "#reviews" className='navLink'>Reviews</a>
            </li>
            <li className='navItem'>
              <a href= "#contact1" className='navLink'>Contact</a>
            </li>
            
            <button className='btn'>
              <a href='/Login'> Espace RH</a>
            </button>

          </ul>

        <div onClick={removeNavbar} className="closeNavbar"> 
          <AiFillCloseCircle className='icon'/>
        </div>

        </div>

        <div onClick={showNav} className="toggleNavbar">
          <TbGridDots className='icon'/>
        </div>
      </header>
    </section>
  )
}

export default Navbar