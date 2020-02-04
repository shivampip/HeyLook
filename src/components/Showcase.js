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

	detactFaces= async (img, canvas)=>{
		//const result= await faceapi.detectSingleFace(img);
		const result= await faceapi.detectAllFaces(img).withFaceLandmarks();
		//const result= await faceapi.detectSingleFace(img).withFaceExpressions();
		//const result= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions();
		//const result= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();
		//const result= await faceapi.detectSingleFace(img).withFaceLandmarks().withAgeAndGender().withFaceDescriptor();
		//const result= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor();

		const displaySize = { width: img.width, height: img.height };
		faceapi.matchDimensions(canvas, displaySize);
		let resizeResults = faceapi.resizeResults(result, displaySize);

		if(resizeResults.length===0){
			this.props.showLog("No face found");
			return true;
		}

		console.log("Showing Detection Results");
		console.log(resizeResults);

		faceapi.draw.drawDetections(canvas, resizeResults);
		this.props.showLog("Face detected");

		faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
		this.props.showLog("Face landmark detected");

	}

	detectFaces= async ()=>{
		const img = document.getElementById("myImg");
		const canvas = document.getElementById("myCan");

		await this.detactFaces(img, canvas);
	}

	componentDidMount() {
		this.imgRef.current.addEventListener("load", this.setSpan);
		if(this.props.detectNow){
			this.detectFaces();
		}else{
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
