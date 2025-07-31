import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Add this
import "./Navbar.css";

const Navbar = ({ scrollToSection, refs }) => {
    const [user, setUser] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const navigate = useNavigate(); // ⬅️ Add this

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        setUser(localStorage.getItem('Username'));
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="header">
            <ul className="header-inner">
                <li className="header-para" onClick={() => scrollToSection(refs.homeRef)}>Home</li>
                <li className="header-para" onClick={() => scrollToSection(refs.aboutRef)}>About Us</li>
                <li className="header-para" onClick={() => scrollToSection(refs.faqRef)}>FAQ</li>
                
                <li className="header-para user-dropdown" ref={dropdownRef}>
                    <span onClick={() => setDropdownOpen(!dropdownOpen)}>{user} ▾</span>
                    {dropdownOpen && (
                        <ul className="dropdown-menu">
                            <li onClick={() => alert("Go to Profile")}>Profile</li>
                            <li onClick={() => {
                                navigate("/change-password"); // ⬅️ Navigate to route
                                setDropdownOpen(false);
                            }}>
                                Change Password
                            </li>
                            <li onClick={logOut}>Logout</li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
