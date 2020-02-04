import "./App.css";
import React from "react";
import ControlPanel from "./ControlPanel";
import Display from "./Display";

import * as faceapi from "face-api.js";
const MODEL_URL = process.env.PUBLIC_URL + "/models";

class App extends React.Component {
	state = { inMode: "browse", logMsg: "Welcome", imgSrc: null };

	setInputMode = mode => {
		this.setState({ inMode: mode });
	};


	loadDetectionModel= async ()=>{
		this.setState({logMsg: "Loading face detection model"});
		await faceapi.loadFaceDetectionModel(MODEL_URL);
		this.setState({logMsg: "Face detection model loaded"});
	}

	loadLandmarkModel= async ()=>{
		this.setState({logMsg: "Loading face landmark detection model"});
		await faceapi.loadFaceLandmarkModel(MODEL_URL);
		//await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
		this.setState({logMsg: "Face landmark detection model loaded"});
		this.setState({logMsg: null});
	}

	async componentDidMount(){
		await this.loadDetectionModel();
		await this.loadLandmarkModel();
	}

	showLog= (msg)=>{
		this.setState({logMsg: msg, inMode: "showcase"});
	}

	onPhoto= (imgSrc)=>{
		console.log("Photo got");
		this.setState({inMode: "showcase", imgSrc: imgSrc});
	}

	render() {
		return (
			<div className="app">
				<Display 
				inMode={this.state.inMode} 
				showLog={this.showLog} 
				onPhoto={this.onPhoto} 
				imgSrc={this.state.imgSrc} 
				detectNow={true} />
				<ControlPanel setInputMode={this.setInputMode} log={this.state.logMsg} />
			</div>
		);
	}
}

export default App;
