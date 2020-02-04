import "./Showcase.css";
import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";
import { render } from "@testing-library/react";
import placeholder from "../images/placeholder.png";
import vplaceholder from "../images/vplaceholder.png";
import shivam from "../images/shivam.jpg";
import mobile from "../images/mobile.jpg";

import * as faceapi from "face-api.js";
const MODEL_URL = process.env.PUBLIC_URL + "/models";
const minConfidence = 0.6;

class Showcase extends React.Component {
	constructor(props) {
		super(props);
		this.state = { cwidth: 0, cheight: 0 };
		this.imgRef = React.createRef();
	}

	async componentDidMount() {
		ToastsStore.success("Hey, Look");
		//this.props.showLog("Showcasing...");
		console.log(this.imgRef);
		this.imgRef.current.addEventListener("load", this.setSpan);
		//return true;

		const img = document.getElementById("myImg");
		const canvas = document.getElementById("myCan");

		let res = await faceapi.detectAllFaces(img).withFaceLandmarks();
		console.log(res);
		//this.props.showLog("Face detected");

		const displaySize = { width: img.width, height: img.height };
		faceapi.matchDimensions(canvas, displaySize);

		const rres = faceapi.resizeResults(res, displaySize);
		faceapi.draw.drawDetections(canvas, rres);
		faceapi.draw.drawFaceLandmarks(canvas, rres);
		console.log("Done");
		ToastsStore.success("Hey Look");
	}

	async loadModels() {
		console.log("Loading models..");
		//await faceapi.loadModels(MODEL_URL);
		await faceapi.loadFaceDetectionModel(MODEL_URL);
		await faceapi.loadFaceLandmarkModel(MODEL_URL);
		//await faceapi.loadFaceRecognitionModel(MODEL_URL);
		console.log("Model loaded");
	}

	setSpan = () => {
		console.log(this.imgRef);
		let cHeight = this.imgRef.current.clientHeight;
		let cWidth = this.imgRef.current.clientWidth;
		let width = this.imgRef.current.naturalWidth;
		let height = this.imgRef.current.naturalHeight;
		let contains = true;
		let fwidth = 0;
		let fheight = 0;

		let oRatio = width / height;
		let cRatio = cWidth / cHeight;

		if (contains ? oRatio > cRatio : oRatio < cRatio) {
			fwidth = cWidth;
			fheight = cWidth / oRatio;
		} else {
			fwidth = cHeight * oRatio;
			fheight = cHeight;
		}

		console.log("fWidth: " + fwidth);
		console.log("fHeight: " + fheight);
		//this.setState({ cwidth: fwidth, cheight: fheight });
	};

	render() {
		let pic = shivam;
		if (this.props.imgSrc) {
			pic = this.props.imgSrc;
		}
		return (
			<div className="showcase">
				<img id="myImg" src={pic} ref={this.imgRef} />
				<canvas
					id="myCan"
					width={this.state.cwidth}
					height={this.state.cheight}
				/>
				<ToastsContainer store={ToastsStore} />
			</div>
		);
	}
}

export default Showcase;
