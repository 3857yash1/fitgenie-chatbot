// import "./Footer.css"
// const Footer = () => {
//     return(
//         <>
//         <footer class="footer">
//                 <p className="footer-heading">FitBot</p>
//                 <p className="footer-developer">Made by <a className="footer-anchor" href="https://github.com/3857yash1">Yashwanth Boorugu</a></p>
//                 <p className="footer-developer"> <a className="footer-anchor" >Saikumar Akarapu</a></p>
//                 <p className="footer-developer"> <a className="footer-anchor" >Navadeep</a></p>
//             </footer>
//         </>
//     )
// }
// export default Footer
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-heading">FitBot</p>
            <p className="footer-developer">
                Made by{' '}
                <a className="footer-anchor" href="https://github.com/3857yash1">Yashwanth B</a>,{' '}
                <a className="footer-anchor" href="https://github.com/saikumarakarapu">Saikumar A</a>, and{' '}
                <a className="footer-anchor" href="https://github.com/navadeep">Navadeep K</a>
            </p>
        </footer>
    );
};

export default Footer;
