import "./Display.css";
import React from "react";
import Camera from "./Camera";

class Display extends React.Component {
	render() {
		return (
			<div className="display">
				Display
				<Camera />
			</div>
		);
	}
}

export default Display;
