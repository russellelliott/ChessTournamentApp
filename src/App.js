import logo from './logo.svg';
import './App.css';
import {useState} from "react"
import {useEffect} from 'react'

//For the router/navbar stuff
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//firebase
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth,db } from "./firebase-config";

//pages
import Login from "./Login"; //login page
import Home from "./Home"; //home page

function App() {

  return (
      <Router>
        <nav>
          <Link to="/"> Home </Link>
          <Link to="/login"> Login </Link>
        </nav>
        <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
  );
}

export default App;