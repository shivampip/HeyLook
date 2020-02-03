import "./Display.css";
import React from "react";
import Camera from "./Camera";
import ImageUpload from "./ImageUpload";
import Showcase from "./Showcase";

class Display extends React.Component {
	state = { mode: "browse", imgSrc: undefined };

	onCapture = img => {
		console.log("Image Reached to Display");
		console.log(img);
		this.setState({ mode: "show", imgSrc: img });
	};

	onSelect = img => {
		console.log("Image selected");
		//let iimg = URL.createObjectURL(img[0]);
		this.setState({ mode: "show", imgSrc: img });
	};

	getRenderContent() {
		if (this.state.mode === "camera") {
			return <Camera onCapture={this.onCapture} />;
		} else if (this.state.mode === "browse") {
			return <ImageUpload onSelect={this.onSelect} />;
		} else {
			return <Showcase imgSrc={this.state.imgSrc} />;
		}
	}
	render() {
		return <div className="display">{this.getRenderContent()}</div>;
	}
}

export default Display;
