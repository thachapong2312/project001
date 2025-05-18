import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import "./login.css";
const ENP = "http://localhost:8800/api"

export default function Login() {

  const userRef = useRef()
  const passwordRef = useRef()
  const {  dispatch, isFetching } = useContext(Context);
  const navigate = useNavigate()
  const [err, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({type:"LOGIN_START"})

    try{
      const res = await axios.post("/api/auth/login", {
        username: userRef.current.value,
        password: passwordRef.current.value,
      })

      const user = Array.isArray(res.data) ? res.data[0] : res.data
      dispatch({type:"LOGIN_SUCCESS",payload: user});

      const timestamp = new Date().getTime()
      const bangkokTime = new Date(timestamp)
      const year = bangkokTime.getFullYear()
      const month = bangkokTime.getMonth() + 1
      const path = Number(user?.prof_id || null)

      if (path) {
        const dataRes = await axios.get(`${ENP}/fetchdbs/committee/setup/${year}_${month}/${path}`)
        localStorage.setItem("resp_data", JSON.stringify(dataRes.data))
      }

      navigate("/")
      window.location.reload()
      
    }catch(err){
      dispatch({type:"LOGIN_FAILURE"});
      setError(err.response.data)

    }
  }

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input className="loginInput" type="" placeholder="Enter your username..." ref={userRef} />
        <label>Password</label>
        <input className="loginInput" type="password" placeholder="Enter your password..." ref={passwordRef} />
         <div className="error-container">
          {err && <p className="error" >{err}</p>}
         </div>
        <button className="loginButton" type="submit" disabled={isFetching} >Login</button>
      </form>
        <button className="loginRegisterButton">
          <Link className="link" to="/register">
            Register
          </Link>
        </button>
    </div>
  );
}