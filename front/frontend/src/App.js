// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Page1 from './component/Page1';
import Formulaire from './component/formulaire';
import SignupForm from './component/SignupForm';
import PageRh from './component/Home/PageRh';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1/>} />
        <Route path="Login" element={<Login/>} />
        <Route path="/Formulaire" element={<Formulaire/>}/>
        <Route path="/SignupForm" element={<SignupForm/>}/>
        <Route path='/PageRh' element={<PageRh/>}/>
        
      </Routes>
    </Router>
  )
}
export default App;
