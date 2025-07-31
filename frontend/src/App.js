import React  from "react";
import "./App.css";
import { Route,Routes, Navigate} from "react-router-dom";
import Login from "./Components/Login/Login"
import Fit from "./Components/Fit/Fit";
import ProtectedRoutes from "./ProtectedRoutes";
import ChangePassword from "./Components/Login/ChangePassword";
const App = () => {
    return (
        <>
        <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<Login/>}></Route>
              <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/" element={<ProtectedRoutes/>}>
                <Route path="/Fit" element={<Fit/>}></Route>
            </Route>
        </Routes>
        </>
    );
};

export default App;
