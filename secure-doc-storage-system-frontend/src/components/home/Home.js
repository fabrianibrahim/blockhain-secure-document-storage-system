import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import LandingImg from "../../assets/images/landing-image.svg";
import arrowIcon from "../../assets/images/arrow.png";

/* Home Page Component */
const Home = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5 col-12 left-col-content">
          <p className="title-text">A FAST SECURE BLOCKCHAIN</p>
          <p className="title-desc-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Link to="/upload-document">
            <button className="header-btn p-2 mt-2 ps-3">
              MINT NOW
              <img src={arrowIcon} className="img-fluid ms-3 me-2" alt="" />
            </button>
          </Link>
        </div>
        <div className="col-md-7 col-12 d-flex justify-content-center p-5 mt-5">
          <img src={LandingImg} className="img-fluid m-5" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
