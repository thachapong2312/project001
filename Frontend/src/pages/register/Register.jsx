import { useState } from "react"
import { Link } from "react-router-dom"
import "./register.css"
import axios from "axios"

export default function Register() {
  const [ prof_name, setProf_name ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()  // use for submit without refessing the page
    setError(false)
    try{
      const res = await axios.post("/api/auth/register", {
        prof_name,
        email,
        password,
      })
      res.data && window.location.replace("/login"); // to redirection to login page
    }catch(err){
      setError(true)
    }
  }

    return (
        <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input className="registerInput" type="" placeholder="Enter your username..." 
        onChange={e => setProf_name(e.target.value)}
        />
        <label>Email</label>
        <input className="registerInput" type="email" placeholder="Enter your email..."
        onChange={e => setEmail(e.target.value)} 
        />
        <label>Password</label>
        <input className="registerInput" type="password" placeholder="Enter your password..."
        onChange={e => setPassword(e.target.value)}
        />
        <button className="registerButton" type="submit">Register</button>
      </form>
        <button className="registerLoginButton">
          <Link className="link" to="/login">
          LOGIN
          </Link>
        </button>
        {error && <span style={{color:"red", marginTop:"10px"}}>Something went worng!</span>}
    </div>
    )
}