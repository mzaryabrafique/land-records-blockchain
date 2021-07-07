import React, { Component } from "react";
import "./FrontSection.css";
import { Button } from "../../Button";
import { Link } from "react-router-dom";
import Web3 from "web3";
import contract from "../../../build/contracts/Land.json"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import xtype from 'xtypejs'


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class CreateLand extends Component {

  constructor(props) {
    super(props);
    this.addData = this.addData.bind(this);
    this.viewLandAssets = this.viewLandAssets.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      account: "",
      id: "",
      state: "",
      district : "",
      village: "",
      surveyNumber: "",
      CurrentOwner: "",
      marketValue: "",
      measurement: "",
      open: false,
      openi: false,
      errori: "",
    };
  }


  async viewLandAssets(e) {
    const web3 = window.web3

    const webeProvider = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await webeProvider.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("Account: " + this.state.account);

    const landCon = new web3.eth.Contract(contract.abi, "0xD39f70CB4D2B86eb9370cE97876a8156f86155cf")
    
    const assets = await landCon.methods.viewAssets().call({ from: this.state.account } )
    
    for(let i=1; i<=assets.length; i++){
      
      const detail = await landCon.methods.landInfoOwner(i).call({ from: this.state.account })
      
      console.log("State: " + detail[0])
      console.log("Destrict: " + detail[1])
      console.log("Village: " + detail[2])

      console.log("---------------------------------")
    }
    // const detail = await landCon.methods.landInfoOwner(this.state.id).call({ from: this.state.account })
    // console.log("Assets: " + assets)
    // console.log("Assets Size: " + assets.length)
    console.log("Type Assets: " + xtype(assets))
    // console.log("Type detail: " + xtype(detail))
    

  }


  async addData(e) {
    e.preventDefault();
    try {
      const web3 = window.web3

      const webeProvider = new Web3(Web3.givenProvider || "http://localhost:7545")
      const accounts = await webeProvider.eth.getAccounts()
      this.setState({ account: accounts[0] })
      console.log("Account: " + this.state.account);

      const landCon = new web3.eth.Contract(contract.abi, "0xD39f70CB4D2B86eb9370cE97876a8156f86155cf")
      
      console.log("CurrentOwner: " + this.state.CurrentOwner);
      console.log("state: " + this.state.state);
      console.log("district: " + this.state.district);
      console.log("village: " + this.state.village);
      console.log("surveyNumber: " + this.state.surveyNumber);
      console.log("id: " + this.state.id);
      console.log("marketValue: " + this.state.marketValue);
      console.log("measurement: " + this.state.measurement);

      await landCon.methods.Registration(this.state.state, this.state.district, this.state.village, this.state.surveyNumber, this.state.CurrentOwner, this.state.marketValue, this.state.id, this.state.measurement).send({ from: this.state.account })

      this.setState({ open: true })
    }
    catch (e) {
      this.setState({ openi: true })
      this.setState({ errori: e.toString() })
      console.log("Error : ", e.toString())
    }

  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleClose(e, r) {
    if (r === 'clickaway') {
      return;
    }

    this.setState({ open: false })
    this.setState({ openi: false })
  }


  render() {
    return (
      <div>
        <div
          className={false ? "home__hero-section" : "home__hero-section darkBg"}
        >
          <div className="container">
            <div
              className="row home__hero-row"
              style={{
                display: "flex",
                flexDirection: "" === "start" ? "row-reverse" : "row",
              }}
            >
              <div className="col">
                <div className="home__hero-text-wrapper">
                  <div className="top-line">{"SECURE DATA"}</div>
                  <h1 className={true ? "heading" : "heading dark"}>
                    {"Create Land"}
                  </h1>
                  <div className="input-areas">
                    <form>
                      <input
                      style={{width:"520px"}}
                        className="footer-input"
                        name="CurrentOwner"
                        type="text"
                        placeholder="Owner Address"
                        value={this.state.CurrentOwner}
                        onChange={this.handleChange}
                      />

                      <input
                        className="footer-input"
                        name="state"
                        type="text"
                        placeholder="State"
                        value={this.state.state}
                        onChange={this.handleChange}
                      />

                      <input
                        className="footer-input"
                        name="district"
                        type="text"
                        placeholder="District"
                        value={this.state.district}
                        onChange={this.handleChange}
                      />

                      <input
                        className="footer-input"
                        name="village"
                        type="text"
                        placeholder="Village"
                        value={this.state.village}
                        onChange={this.handleChange}
                      />

                      <input
                        className="footer-input"
                        name="surveyNumber"
                        type="text"
                        placeholder="Survey Number"
                        value={this.state.surveyNumber}
                        onChange={this.handleChange}
                      />

                       <input
                        className="footer-input"
                        name="marketValue"
                        type="text"
                        placeholder="Market Value"
                        value={this.state.marketValue}
                        onChange={this.handleChange}
                      />

                      <input
                        className="footer-input"
                        name="measurement"
                        type="text"
                        placeholder="Measurements"
                        value={this.state.measurement}
                        onChange={this.handleChange}
                      />

                       <input
                        className="footer-input"
                        name="id"
                        type="text"
                        placeholder="ID"
                        value={this.state.id}
                        onChange={this.handleChange}
                      />


                      <Button
                        buttonSize="btn--mobile"
                        buttonColor="blue"
                        onClick={this.addData}
                      >
                        Create Land
                      </Button>

                    </form>

                    <Button
                        buttonSize="btn--mobile"
                        buttonColor="blue"
                        onClick={this.viewLandAssets}
                      >
                        View Assets
                      </Button>


                    <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                      <Alert onClose={this.handleClose} severity="success">
                        Land Created successfully. Owner: {this.state.CurrentOwner}
                      </Alert>
                    </Snackbar>

                    <Snackbar open={this.state.openi} autoHideDuration={6000} onClose={this.handleClose}>
                      <Alert onClose={this.handleClose} severity="error">
                        {this.state.errori}
                      </Alert>
                    </Snackbar>

                  </div>
                </div>
              </div>
              <div className="col">
                <div className="home__hero-img-wrapper">
                  <img
                    src={"images/svg-6.svg"}
                    alt={"Credit Card"}
                    className="home__hero-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function FrontSection({
  lightBg,
  topLine,
  lightText,
  headline,
  buttonLabel,
  form,
  img,
  alt,
  imgStart,
}) {
  if (form) {
    return <CreateLand />;
  }

  return (
    <div>
      <div
        className={lightBg ? "home__hero-section" : "home__hero-section darkBg"}
      >
        <div className="container">
          <div
            className="row home__hero-row"
            style={{
              display: "flex",
              flexDirection: imgStart === "start" ? "row-reverse" : "row",
            }}
          >
            <div className="col">
              <div className="home__hero-text-wrapper">
                <div className="top-line">{topLine}</div>
                <h1 className={lightText ? "heading" : "heading dark"}>
                  {headline}
                </h1>

                <Link to="/sign-up">
                  <Button buttonSize="btn--wide" buttonColor="blue">
                    {buttonLabel}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="col">
              <div className="home__hero-img-wrapper">
                <img src={img} alt={alt} className="home__hero-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontSection;
