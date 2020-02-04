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

const SWAG_GLASS = process.env.PUBLIC_URL + "/images/swag_glass_cropped.png";

class Showcase extends React.Component {
	constructor(props) {
		super(props);
		this.state = { cwidth: 0, cheight: 0 };
		this.imgRef = React.createRef();
	}

	print = msg => {
		console.log(msg);
	};

	postProcessing = (img, canvas, results) => {
		console.clear();
		this.print("Post processing");
		let landmarks = results.landmarks;
		this.print(landmarks);

		let nose = landmarks.getNose();
		let leftEye = landmarks.getLeftEye();
		let rightEye = landmarks.getRightEye();
		this.print(leftEye);
		this.print(rightEye);

		let lpx = leftEye[0].x;
		let lpy = leftEye[0].y;
		let rpx = rightEye[3].x;
		let rpy = rightEye[3].y;

		let ww = rpx - lpx;
		const angle = Math.atan2(rpy - lpy, rpx - lpx);
		//* (180 / Math.PI);  //degree
		let extra = ww / 5;

		let llpx = extra * Math.cos(angle);
		let llpy = extra * Math.sin(angle);
		lpx = lpx - llpx;
		lpy = lpy - llpy;
		ww = ww + extra * 2;

		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(lpx, lpy);
		ctx.lineTo(rpx, rpy);
		ctx.stroke();

		let drawing = new Image();
		drawing.src = SWAG_GLASS; // can also be a remote URL e.g. http://

		ctx.translate(lpx, lpy);
		ctx.rotate(angle);

		drawing.onload = function() {
			let ratio = drawing.width / ww;
			let hh = drawing.height / ratio;
			ctx.drawImage(drawing, 0, 0, ww, hh);

			console.log("Width: " + ww);
			console.log("Height: " + hh);
			ctx.rotate(-angle);
			ctx.translate(0, 0);
		};
	};

	resizeResults = (img, canvas, result) => {
		const displaySize = { width: img.width, height: img.height };
		faceapi.matchDimensions(canvas, displaySize);
		return faceapi.resizeResults(result, displaySize);
	};

	detactFaces = async (img, canvas) => {
		let useTinyModel = true;
		const result = await faceapi
			.detectSingleFace(img)
			.withFaceLandmarks(useTinyModel);
		//.withFaceExpressions();

		let resizeResults = this.resizeResults(img, canvas, result);

		if (resizeResults.length === 0) {
			this.props.showLog("No face found");
			return true;
		}

		console.log("Showing Detection Results");
		console.log(resizeResults);

		faceapi.draw.drawDetections(canvas, resizeResults);
		this.props.showLog("Face detected");

		faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
		this.props.showLog("Face landmark detected");

		// faceapi.draw.drawFaceExpressions(canvas, resizeResults);
		// this.props.showLog("Face expression detected");

		this.postProcessing(img, canvas, resizeResults);
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

		await this.detactFaces(img, canvas);
		//await this.detect5Points(img, canvas);
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
