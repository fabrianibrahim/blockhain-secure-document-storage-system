import { NavLink } from "react-router-dom";
import "./Navbar.css";
import walletIcon from "../../assets/images/wallet-icon.svg";
import walletImg from "../../assets/images/wallet.png";

/* Navbar Component, we show three routes( Home, Documents, Upload Document) and connect wallet button 
to make connection with metamask wallet */

const Navbar = ({
  errorMessage,
  walletConnected,
  connectWalletHandler,
  defaultAccount,
}) => {
  return (
    <nav className="container-fluid navbar navbar-expand-lg navbar-light navbar-background">
      <div className="container">
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse m-2" id="navbarToggler">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link navbar-text-style" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link navbar-text-style"
                to="/my-documents"
              >
                Documents
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link navbar-text-style"
                to="/upload-document"
              >
                Upload-Docs
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="nav-item navbar-text-style">
          {walletConnected && defaultAccount ? (
              <div>
                {defaultAccount}
                <img src={walletIcon} className="img-fluid ms-3" alt="" />
              </div>
            ) : (
              <button
                id="connect-btn"
                className="btn navbar-btn-style"
                onClick={connectWalletHandler}
              >
              <img src={walletImg} className="img-fluid me-2" alt="" />
                Connect
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
