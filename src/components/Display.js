import "./Display.css";
import React from "react";
import Camera from "./Camera";
import ImageUpload from "./ImageUpload";
import Showcase from "./Showcase";

class Display extends React.Component {
	state = { imgSrc: undefined };

	onCapture = img => {
		this.props.onPhoto(img);
	};

	onSelect = img => {
		this.props.onPhoto(img);
	};

	getRenderContent() {
		if(this.props.inMode==="showcase"){
			return <Showcase imgSrc={this.props.imgSrc} showLog={this.props.showLog} detectNow={this.props.detectNow}/>;
		}else if (this.props.inMode === "camera") {
			return <Camera onCapture={this.onCapture} />;
		} else {
			return <ImageUpload onSelect={this.onSelect} />;
		}
	
	}
	render() {
		return <div className="display">{this.getRenderContent()}</div>;
	}
}

export default Display;
