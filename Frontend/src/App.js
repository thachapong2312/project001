import Topbar from "./components/topbar/Topbar";
import Homepage from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Subject from "./components/subject/Subject"
import Outcome from "./pages/outcome/Outcome";
import Evaluation from "./pages/evaluation/Evaluation"
import Error from "./pages/error/Error";
import TestData from "./components/compute outcome/TestData"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "./context/Context";
import socket from "./socket";
import { useParams, Navigate } from "react-router-dom";

function App() {
  const { user } = useContext(Context);
  
  const OutcomeWrapper = () => {
    const { id, pi_id } = useParams();
    if (!pi_id || pi_id === "null" || pi_id === "undefined") {
      return <Navigate to="/error" replace />;
    }
    return <Outcome />;
  };

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to server:", socket.id);
    });
    socket.on("reply", (data) => {
      console.log("Reply from server:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, [])

  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/posts" element={<Homepage />} />
        <Route path="/subject/:id" element={<Subject/>} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/register" element={user ? <Homepage /> : <Register />} />
        {/* <Route path="/login" element={user ? <Homepage /> : <Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/evaluate/:id" element={<Evaluation />} />
        <Route path="/outcome/:id/:pi_id" element={user ? <OutcomeWrapper /> : <Login />} />
        <Route path="/settings" element={user ? <Settings /> : <Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/TestData" element={<TestData />} />
      </Routes>
    </Router>
  );
}

export default App;
