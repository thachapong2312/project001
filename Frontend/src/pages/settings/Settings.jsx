import { useContext, useState } from "react";
import { Context } from "../../context/Context"
import axios from "axios"
import "./settings.css";

export default function Settings() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const {user, dispatch} = useContext(Context)

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Please fill in all detail!");
      setSuccess(false);
      return;
    }
    const updatedUser = {
      prof_id: user.prof_id,
      username,
      email,
      password
    }

    try{
      const res = await axios.put(`api/users/${user.prof_id}`, updatedUser)
      setSuccess(true)
      setError("")
      dispatch({type:"UPDATE_SUCCESS", payload: res.data[0] })
    }catch(err){
      setError("Failed to update account")
      setSuccess(false)
      dispatch({type:"UPDATE_FAILURE"})
    }
  }

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Your Account</span>
          <span className="settingsTitleDelete"></span>
        </div>
        <form action="" className="settingsForm" onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="" placeholder={user.username} onChange={e=>setUsername(e.target.value)} name="name" />
          <label>Email</label>
          <input type="email" placeholder={user.email} onChange={e=>setEmail(e.target.value)} name="email" />
          <label>Password</label>
          <input type="password" onChange={e=>setPassword(e.target.value)} name="password" />
          <button className="settingsSubmitButton" type="submit">
            Update
          </button>
          {success && <span style={{color: "green", textAlign: "center", marginTop: "20px"}}>Profile has been updated...</span>}
          {error && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</span>}
        </form>
      </div>
    </div>
  );
}