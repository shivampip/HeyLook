import "./ControlPanel.css";
import React from "react";

class ControlPanel extends React.Component {
	state = {
		cameraClass: "btnActive",
		uploadClass: "btnInActive"
	};
	setCamera = () => {
		this.setState({ cameraClass: "btnActive", uploadClass: "btnInactive" });
	};

	setUpload = () => {
		this.setState({ cameraClass: "btnInactive", uploadClass: "btnActive" });
	};

	render() {
		return (
			<div className="control-panel">
				<div className="wrapper">
					<div className="screen"></div>
					<div className="uploadBtnWrapper">
						<button onClick={this.setCamera} className={this.state.cameraClass}>
							Camera
						</button>
						<button onClick={this.setUpload} className={this.state.uploadClass}>
							Upload
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ControlPanel;
