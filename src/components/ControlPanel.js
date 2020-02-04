import "./ControlPanel.css";
import React from "react";

class ControlPanel extends React.Component {
	constructor(props) {
		super(props);
	}
	state = {
		cameraClass: "btnActive",
		uploadClass: "btnInActive",
		logs: []
	};
	setCamera = () => {
		this.setState({ cameraClass: "btnActive", uploadClass: "btnInactive" });
		this.props.setInputMode("camera");
		this.addLog("Camera Set");
	};

	setUpload = () => {
		this.setState({ cameraClass: "btnInactive", uploadClass: "btnActive" });
		this.props.setInputMode("browse");
		this.addLog("File brower set");
	};

	addLog = (text, col = "#94ffc8") => {
		this.state.logs.push(
			<span style={{ color: col, fontWeight: "bold" }}>
				$ &nbsp;&nbsp;{text}
				<br />
			</span>
		);
		this.setState({
			logs: this.state.logs
		});
	};

	componentWillUpdate(){
		this.state.logs.push(
			<span style={{ color: "#94ffc8", fontWeight: "bold" }}>
				$ &nbsp;&nbsp;{this.props.log}
				<br />
			</span>
		);
	}


	render() {
		return (
			<div className="control-panel">
				<div className="wrapper">
					<div className="screen">{this.state.logs}</div>
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
