import "./App.css";
import React from "react";
import ControlPanel from "./ControlPanel";
import Display from "./Display";

class App extends React.Component {
	state = { inMode: "browse" };

	setInputMode = mode => {
		this.setState({ inMode: mode });
	};

	render() {
		return (
			<div className="app">
				<Display inMode={this.state.inMode} />
				<ControlPanel setInputMode={this.setInputMode} />
			</div>
		);
	}
}

export default App;
