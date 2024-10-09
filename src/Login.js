import logo from './logo.svg';
import './App.css';
import {useState} from "react"
import {useEffect} from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
//onAuthStateChanged is trigered every time there is change in auth state
import {auth} from "./firebase-config"


function Login() {

  //using "use state hooks" to get data from fields
  
  //registerEmail = email used to register account
  //setRegisterEmail = set the email

  //register the email and password and set them
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  //login the email and password and set them
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  //state for the current user so it persists across user sessions
  const [user, setUser] = useState({});
  /*onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })*/
  
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

}, [])

  //function to register, login, and logout are async await, because they deal with firebase stuff inside

  //function to register user
  const register = async () => {
    try{
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      console.log(user)
    } catch(error){
      console.log(error.message); //print error to console log
      alert(error.message);
    }

  };

  //function to login existing user
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user); //user logged in
      window.location.pathname = "/"; //go to the home page
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };
  
  //function to log user out of their account
  const logout = async () => {
    await signOut(auth);
    window.location.pathname = "/"; //go to the homepage
  };

  return (
    <div className="App">
      <div>
        <h3>Registered User</h3>
        <input placeholder = "Email..." onChange={(event) => {setRegisterEmail(event.target.value)}}></input>
        <input placeholder = "Password..." onChange={(event) => {setRegisterPassword(event.target.value)}}></input>
        <button onClick = {register}>Create User</button>
      </div>
      <div>
        <h3>Login</h3>
        <input placeholder = "Email..." onChange={(event) => {setLoginEmail(event.target.value)}}></input>
        <input placeholder = "Password..." onChange={(event) => {setLoginPassword(event.target.value)}}></input>
        <button onClick = {login}>Login</button>
      </div>
      
      <h4>User Logged In: </h4>
      {user ? user.email : "Not Logged In"}
      <button onClick = {logout}>Sign Out</button>


    </div>
  );
}

export default Login;