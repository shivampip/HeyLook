import "./Display.css";
import React from "react";
import Camera from "./Camera";
import ImageUpload from "./ImageUpload";
import Showcase from "./Showcase";

class Display extends React.Component {
	render() {
		return (
			<div className="display">
				{/* <Camera /> */}
				{/* <ImageUpload/> */}
				<Showcase/>
			</div>
		);
	}
}

export default Display;
