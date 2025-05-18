import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/Context";
import "./topbar.css";

export default function Topbar() {
  const { user, dispatch } = useContext(Context);
  const prof = user?.prof_id || null
  const Pidata = JSON.parse(localStorage.getItem("resp_data")) || []
  const Pid = Pidata.length > 0 ? Pidata[0].PI_id : null;

  const handleLogout = () =>{
    dispatch({type:"LOGOUT"});
}

  return (
    <div className="top">
      <div className="topLeft">
        {/* <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-twitter-square"></i> */}
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              HOME
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/error">
              ABOUT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/error">
              CONTACT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/evaluation">
            EVALUATION
            </Link>
          </li>
          <li className="topListItem">
            {prof && user ? (
              <Link className="link" to={`/outcome/${prof}/${Pid}`}>
                OUTCOME
              </Link>
            ) : (
              <Link className="link" to="/"></Link>
            )}
          </li>
          <Link className="link" to="/" >
            <li className="topListItem" onClick={handleLogout}>
              {user && "LOGOUT"}
            </li>
          </Link>
        </ul>
      </div>
      <div className="topRight">
        {user ? (
          <Link className="link" to="/settings">
            <img
              className="topImg"
              src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
              alt=""
            />
          </Link>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
        <i className="topSearchIcon fas fa-search"></i>
      </div>
    </div>
  );
}