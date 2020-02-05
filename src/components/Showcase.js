import "./Showcase.css";
import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";
import { render } from "@testing-library/react";
import placeholder from "../images/placeholder.png";
import vplaceholder from "../images/vplaceholder.png";
import { FacePainter } from "./Painter";

import * as faceapi from "face-api.js";
const MODEL_URL = process.env.PUBLIC_URL + "/models";
const minConfidence = 0.6;

const SWAG_GLASS = process.env.PUBLIC_URL + "/images/swag_glass_cropped.png";
const SWAG_CIGAR = process.env.PUBLIC_URL + "/images/cigra_modi.png";
const SWAG_CHAIN = process.env.PUBLIC_URL + "/images/chain.png";

class Showcase extends React.Component {
	constructor(props) {
		super(props);
		this.state = { cwidth: 0, cheight: 0 };
		this.imgRef = React.createRef();
	}

	print = msg => {
		console.log(msg);
	};

	resizeResults = (img, canvas, result) => {
		const displaySize = { width: img.width, height: img.height };
		faceapi.matchDimensions(canvas, displaySize);
		return faceapi.resizeResults(result, displaySize);
	};

	detactFaces = async (img, canvas) => {
		let useTinyModel = true;
		console.log("Start Face Detection");
		console.log(faceapi.nets.ssdMobilenetv1);
		if (!!faceapi.nets.ssdMobilenetv1.params) {
			console.log("Model Loaded");
		} else {
			console.log("Model not loaded yet");
			this.props.showLog("Model not loaded yet");
			return true;
		}
		const result = await faceapi
			.detectSingleFace(img)
			.withFaceLandmarks(useTinyModel);
		//.withFaceExpressions();
		console.log("Got the results");

		let resizeResults = this.resizeResults(img, canvas, result);

		if (resizeResults.length === 0) {
			this.props.showLog("No face found");
			return true;
		}

		console.log("Showing Detection Results");
		console.log(resizeResults);

		//faceapi.draw.drawDetections(canvas, resizeResults);
		this.props.showLog("Face detected");

		// faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
		this.props.showLog("Face landmark detected");

		// faceapi.draw.drawFaceExpressions(canvas, resizeResults);
		// this.props.showLog("Face expression detected");

		//this.postProcessing(img, canvas, resizeResults);
		let fp = new FacePainter(img, canvas, resizeResults.landmarks);
		await fp.putGlasses(SWAG_GLASS, false);
		this.props.showLog("Glasses Put");
		await fp.putChain(SWAG_CHAIN, false);
		this.props.showLog("Chain Put");
		await fp.putCigar(SWAG_CIGAR, false);
		this.props.showLog("Cigra Put");
		//this.downlaodPhoto(canvas);
	};

	downlaodPhoto = canvas => {
		var link = document.createElement("a");
		link.innerHTML = "Download Image";
		link.addEventListener(
			"click",
			function(ev) {
				link.href = canvas.toDataURL();
				link.download = "mypainting.png";
			},
			false
		);
		link.click();
	};

	detect5Points = async (img, canvas) => {
		let result = await faceapi.mtcnn(img);
		let resizeResults = this.resizeResults(img, canvas, result);
		faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
		this.props.showLog("Face landmark 5 point detected");
	};

	detectFaces = async () => {
		const img = document.getElementById("myImg");
		const canvas = document.getElementById("myCan");

		try {
			await this.detactFaces(img, canvas);
			//await this.detect5Points(img, canvas);
		} catch (err) {
			console.log("Model Not Loaded");
		}
	};

	componentDidMount() {
		this.imgRef.current.addEventListener("load", this.setSpan);
		if (this.props.detectNow) {
			this.detectFaces();
		} else {
			this.props.showLog("Auto face detection disabled");
		}
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

		console.log("finalWidth: " + fwidth);
		console.log("finalHeight: " + fheight);
	};

	render() {
		let pic = placeholder;
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
