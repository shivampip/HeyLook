import "./Display.css";
import React from "react";
import Camera from "./Camera";
import ImageUpload from "./ImageUpload";
import Showcase from "./Showcase";

class Display extends React.Component {
	state = { isImgChoosen: false, imgSrc: undefined };

	onCapture = img => {
		console.log("Image Reached to Display");
		console.log(img);
		this.setState({ isImgChoosen: true, imgSrc: img });
	};

	onSelect = img => {
		console.log("Image selected");
		//let iimg = URL.createObjectURL(img[0]);
		this.setState({ isImgChoosen: true, imgSrc: img });
	};

	getRenderContent() {
		if (this.state.isImgChoosen) {
			this.state.isImgChoosen = false;
			return <Showcase imgSrc={this.state.imgSrc} />;
		} else {
			if (this.props.inMode === "camera") {
				return <Camera onCapture={this.onCapture} />;
			} else {
				return <ImageUpload onSelect={this.onSelect} />;
			}
		}
	}
	render() {
		return <div className="display">{this.getRenderContent()}</div>;
	}
}

export default Display;
