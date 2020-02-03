import "./Showcase.css";
import React from 'react';
import { render } from '@testing-library/react';
import placeholder from "../images/placeholder.png";
import vplaceholder from "../images/vplaceholder.png";
import shivam from "../images/shivam.jpg";

import * as faceapi from 'face-api.js';
const MODEL_URL = '../models/weights/';
const minConfidence = 0.6;

class Showcase extends React.Component{
    constructor(props){
        super(props);
        this.state= {cwidth: 0, cheight: 0};
        this.imgRef = React.createRef();
    }

    
    async componentDidMount() {
        
		    console.log(this.imgRef);
        //this.imgRef.current.addEventListener("load", this.setSpan);
        
        await this.loadModels();
        console.log("post model load");
        const testImageHTML = document.getElementById('myImg')
        this.drawHTMLImage(this.canvas.current,testImageHTML,296,296);
        await this.getFullFaceDescription(this.canvas.current);
        this.drawDescription(this.canvas.current);
      }
    
      async loadModels () {
          console.log("Loading models..");
        //await faceapi.loadModels(MODEL_URL);
        await faceapi.loadFaceDetectionModel(MODEL_URL);
        console.log("inter");
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
        console.log("Model loaded");
      }

	setSpan = () => {
		console.log(this.imgRef);
		let cHeight = this.imgRef.current.clientHeight;
		let cWidth = this.imgRef.current.clientWidth;
		let width = this.imgRef.current.naturalWidth;
        let height = this.imgRef.current.naturalHeight;
        let contains= true;
        let fwidth= 0;
        let fheight= 0;
        
        console.log("cWidth: "+cWidth);
        console.log("cHeight: "+cHeight);
        console.log("Width: "+width);
        console.log("Height: "+height);
        
        let oRatio = width / height;
        let cRatio = cWidth / cHeight;

        if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
          fwidth = cWidth;
          fheight = cWidth / oRatio;
        } else {
          fwidth = cHeight * oRatio;
          fheight = cHeight;
        }   

        console.log("fWidth: "+fwidth);
        console.log("fHeight: "+fheight);
		this.setState({ cwidth: fwidth, cheight: fheight });
	};
    

    render(){
        return (<div className="showcase">
            <img id="myImg" src={shivam} ref={this.imgRef}/>
            <canvas width={this.state.cwidth} height={this.state.cheight}/>
        </div>);
    }
}

export default Showcase;