import React from "react";
import './footer.css';
import fb from '../assets/fbimg.png';
import twitter from '../assets/twitterimg.png';
import linkedin from '../assets/linkedinimg.png';
import insta from '../assets/instaimg.png';
import kjsce from '../assets/kjsceimg.svg';


const Footer =({style})=> {
    return (
        <div className="footer" style={style}>
            <div className="sb_footer section_padding">
                <div className="sb__footer-links">
                    <div className="sb__footer-links_div_left">
                        <h4><img src={kjsce} alt=""/></h4>
                        <div className="socialmedia">
                            <p><img src={fb} alt=""/></p>
                            <p><img src={twitter} alt=""/></p>
                            <p><img src={linkedin} alt=""/></p>
                            <p><img src={insta} alt=""/></p>
                        </div>
                    </div>
                    <div className="sb__footer-links_div_right">
                        <div className="sb__footer-links_div">
                            <h4>About Us</h4>
                            <a href="/about">
                                <p>About KJSCE</p>
                            </a>
                            <a href="/vision">
                                <p>Vision and Mission</p>
                            </a>
                            <a href="/organ">
                                <p>Organization</p>
                            </a>
                        </div>
                        <div className="sb__footer-links_div">
                            <h4>Updates</h4>
                            <a href="/notice">
                                <p>Notices</p>
                            </a>
                            <a href="/downloads">
                                <p>Downloads</p>
                            </a>
                            <a href="/news">
                                <p>News</p>
                            </a>
                        </div>
                        <div className="sb__footer-links_div">
                            <h4>Connect</h4>
                            <a href="/events">
                                <p>Events</p>
                            </a>
                            <a href="/career">
                                <p>Career</p>
                            </a>
                            <a href="/contact">
                                <p>Contact</p>
                            </a>
                        </div>
                    </div>
                </div>

            <hr></hr>

            <div className="sb__footer-below">
                <div className="sb__footer-copyright">
                    <p>
                        @{new Date().getFullYear()} KJSCE. All Rights Reserved.
                    </p>
                </div>
                <div className="sb__footer-below-links">
                    <a href="/terms"><div className="terms-link"><p>Terms & Conditions</p></div></a>
                    <a href="/privacy"><div className="privacy-link"><p>Privacy</p></div></a>
                    <a href="/security"><div className="security-link"><p>Security</p></div></a>
                </div>
            </div>

        </div>
        </div>
    )
}

export default Footer