import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";
//import { MdFingerprint } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import logo from "../components/logo.png";

import "./menu.css";
import "../App.css";
import Web3 from "web3";
import contract from "../build/contracts/Auth.json";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.showButton = this.showButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isActive: false,
      name: false,
      balance: "",
      dropdownRef: null,
      click: false,
      button: true,
      cookieUser: cookies.get("checkIsUser"),
    };
  }

  componentWillMount() {
    console.log("isActive", this.state.isActive);

    if (this.state.isActive) {
      this.pageClickEvent();

      if (this.state.isActive) {
        window.addEventListener("click", this.state.pageClickEvent);
      }

      window.removeEventListener("click", this.state.pageClickEvent);
    }

    this.showButton();

    window.addEventListener("resize", this.showButton());

    this.setState({ name: cookies.get("Username") });
    console.log("name", this.state.name);

    this.getBalance();
  }

  onClick() {
    console.log("isActive", this.state.isActive);
    this.setState({ isActive: !this.state.isActive });
  }

  pageClickEvent(e) {
    if (
      this.state.dropdownRef.current !== null &&
      !this.state.dropdownRef.current.contains(e.target)
    ) {
      this.setState({ isActive: !this.state.isActive });
    }
  }

  handleClick() {
    this.setState({ click: !this.state.click });
  }

  closeMobileMenu() {
    this.setState({ click: false });
  }

  showButton() {
    if (window.innerWidth <= 960) {
      this.setState({ button: false });
    } else {
      this.setState({ button: true });
    }
  }

  async getBalance() {
    const web3 = window.web3;
    const webeProvider = new Web3(
      Web3.givenProvider || "http://localhost:7545"
    );
    const accounts = await webeProvider.eth.getAccounts();

    const blnce = web3.utils.fromWei(
      await web3.eth.getBalance(accounts[0]),
      "ether"
    );
    console.log(blnce);
    this.setState({ balance: blnce });
  }

  async logout() {
    const web3 = window.web3;

    const webeProvider = new Web3(
      Web3.givenProvider || "http://localhost:7545"
    );
    const accounts = await webeProvider.eth.getAccounts();
    console.log("Account: " + accounts[0]);

    const netId = await web3.eth.net.getId();
    const deployedNetwork = contract.networks[netId];

    const authContract = new web3.eth.Contract(
      contract.abi,
      deployedNetwork.address
    );

    await authContract.methods
      .logoutUser(accounts[0])
      .send({ from: accounts[0] });

    const checkIsAdmin = await authContract.methods
      .checkIsUserLogged(accounts[0])
      .call({ from: accounts[0] });

    console.log("checkIsUser : " + checkIsAdmin[0]);
    console.log("checkIsUser : " + checkIsAdmin[1]);

    cookies.remove("checkIsUser");
    console.log(cookies.get("checkIsUser"));
    window.location = "/";
  }

  // if (cookies.get("checkIsUser")) {
  //   console.log("checkIsUser: ", cookies.get("checkIsUser"));

  //   return <Home />;
  // } else {
  //   console.log("checkIsUser: ", cookies.get("checkIsUser"));
  //   return <LoginSignUp />;
  // }

  render() {
    return (
      <div>
        {this.state.cookieUser ? (
          <div>
            <IconContext.Provider value={{ color: "#fff" }}>
              <nav className="navbar">
                <div className="navbar-container container">
                  <Link
                    to="/"
                    className="navbar-logo"
                    onClick={this.closeMobileMenu}
                  >
                    {/* <MdFingerprint className="navbar-icon" /> */}
                    <img
                      src={logo}
                      className="App-logo"
                      alt="Logo"
                      width="40"
                      height="40"
                    />
                    &nbsp;&nbsp;{" "}
                    <p>
                      <font color="#EF8E19">Blockchain</font> Land Records
                      System
                    </p>
                  </Link>
                  <div className="menu-icon" onClick={this.handleClick}>
                    {this.state.click ? <FaTimes /> : <FaBars />}
                  </div>
                  <ul
                    className={
                      this.state.click ? "nav-menu active" : "nav-menu"
                    }
                  >
                    <li className="nav-item">
                      <Link
                        to="/"
                        className="nav-links"
                        onClick={this.closeMobileMenu}
                      >
                        {" "}
                        Home
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to="/search-property"
                        className="nav-links"
                        onClick={this.closeMobileMenu}
                      >
                        Explore
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to="/properties"
                        className="nav-links"
                        onClick={this.closeMobileMenu}
                      >
                        Properties
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/requests"
                        className="nav-links"
                        onClick={this.closeMobileMenu}
                      >
                        Requests
                      </Link>
                    </li>

                    <div className="menu-container">
                      <button
                        onClick={this.onClick}
                        className="menu-trigger"
                      >
                        <span>User</span>
                        <img
                          width="40"
                          height="40"
                          src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/df/df7789f313571604c0e4fb82154f7ee93d9989c6.jpg"
                          alt="User avatar"
                        />
                      </button>
                      <nav
                        ref={this.state.dropdownRef}
                        className={`menu ${
                          this.state.isActive ? "active" : "inactive"
                        }`}
                      >
                        <ul>
                          <li>
                            <h3 style={{ color: "#35A246" }}>
                              {this.state.name}
                            </h3>
                          </li>
                          <li>
                            <h4 style={{ color: "#EF8E19" }}>
                              Balance: {this.state.balance} ETH
                            </h4>
                          </li>
                          <li>
                            <Link
                              to="/profile"
                              className="nav-links"
                              onClick={this.closeMobileMenu}
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/requested-lands"
                              className="nav-links"
                              onClick={this.closeMobileMenu}
                            >
                              Requested Lands
                            </Link>
                          </li>
                          <li>
                            {this.state.button ? (
                              <Link to="/">
                                <Button buttonSize="btn--wide">Sign Out</Button>
                              </Link>
                            ) : (
                              <Link to="/">
                                <Button buttonSize="btn--wide">Sign Out</Button>
                              </Link>
                            )}
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </ul>
                </div>
              </nav>
            </IconContext.Provider>
          </div>
        ) : (
          <div>
            <IconContext.Provider value={{ color: "#fff" }}>
              <nav className="navbar">
                <div className="navbar-container container">
                  <Link
                    to="/"
                    className="navbar-logo"
                    onClick={this.closeMobileMenu}
                  >
                    {/* <MdFingerprint className="navbar-icon" />
                    Blockchain Land Records System */}
                    {/* <img src={logo} alt="Logo" width="40" height="40" />&nbsp;<p style={{ color: '#EF8E19' }}>Blockchain</p> &nbsp; <p>Land Records System</p> */}
                    <img
                      src={logo}
                      className="App-logo"
                      alt="Logo"
                      width="40"
                      height="40"
                    />{" "}
                    &nbsp;&nbsp;{" "}
                    <p>
                      <font color="#EF8E19">Blockchain</font> Land Records
                      System
                    </p>
                  </Link>
                  <div className="menu-icon" onClick={this.handleClick}>
                    {this.state.click ? <FaTimes /> : <FaBars />}
                  </div>
                  <ul
                    className={
                      this.state.click ? "nav-menu active" : "nav-menu"
                    }
                  >
                    <li className="nav-item">
                      <Link
                        to="/"
                        className="nav-links"
                        onClick={this.closeMobileMenu}
                      >
                        Home
                      </Link>
                    </li>

                    <li className="nav-btn">
                      {this.state.button ? (
                        <Link to="/sign-in" className="btn-link">
                          <Button buttonStyle="btn--outline">SIGN IN</Button>
                        </Link>
                      ) : (
                        <Link to="/sign-in" className="btn-link">
                          <Button
                            buttonStyle="btn--outline"
                            buttonSize="btn--mobile"
                            onClick={this.closeMobileMenu}
                          >
                            SIGN IN
                          </Button>
                        </Link>
                      )}
                    </li>
                    <li className="nav-btn">
                      {this.state.button ? (
                        <Link to="/sign-up" className="btn-link">
                          <Button buttonStyle="btn--outline">SIGN UP</Button>
                        </Link>
                      ) : (
                        <Link to="/sign-up" className="btn-link">
                          <Button
                            buttonStyle="btn--outline"
                            buttonSize="btn--mobile"
                            onClick={this.closeMobileMenu}
                          >
                            SIGN UP
                          </Button>
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </nav>
            </IconContext.Provider>
          </div>
        )}
      </div>
    );
  }
}

export default Navbar;
