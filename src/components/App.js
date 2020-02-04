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

	loadDetectionModel = async () => {
		//await faceapi.loadFaceDetectionModel(MODEL_URL);
		await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
		//await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
		this.setState({ logMsg: "Face detection model loaded" });
	};

	loadLandmarkModel = async () => {
		//await faceapi.loadFaceLandmarkModel(MODEL_URL);
		await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
		this.setState({ logMsg: "Face landmark detection model loaded" });
	};

	loadExpressionModel = async () => {
		await faceapi.loadFaceExpressionModel(MODEL_URL);
		this.setState({ logMsg: "Face expression detection model loaded" });
	};

	loadMtcnnModel = async () => {
		await faceapi.loadMtcnnModel(MODEL_URL);
		this.setState({ logMsg: "Mtcnn model loaded" });
	};

	async componentDidMount() {
		await this.loadDetectionModel();
		await this.loadLandmarkModel();
		await this.loadExpressionModel();
		//await this.loadMtcnnModel();
		this.setState({ logMsg: null });
	}

	showLog = msg => {
		this.setState({ logMsg: msg, inMode: "showcase" });
	};

	onPhoto = imgSrc => {
		console.log("Photo got");
		this.setState({ inMode: "showcase", imgSrc: imgSrc });
	};

	render() {
		return (
			<div className="app">
				<Display
					inMode={this.state.inMode}
					showLog={this.showLog}
					onPhoto={this.onPhoto}
					imgSrc={this.state.imgSrc}
					detectNow={true}
				/>
				<ControlPanel
					setInputMode={this.setInputMode}
					log={this.state.logMsg}
				/>
			</div>
		);
	}
}

export default App;
