import { useNavigate } from "react-router";
import { useContext } from "react";
import { Context } from "../../context/Context";
import "./home.css";
import Header from "../../components/header/Header";

export default function Homepage() {
  const { user } = useContext(Context);
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleAccess = () => {
    const navigatepath = user.prof_id
    navigate(`/subject/${navigatepath}`)
  }

  return (
    <>
      <Header />
      <div className="home">
        <div className="login-container">
          {user ? (
            <button className="button-52" onClick={handleAccess}>SUBJECT</button>
          )
          :(
            <button className="button-52" onClick={handleLogin}>LOGIN</button>
          )}
        </div>
      </div>
    </>
  );
}