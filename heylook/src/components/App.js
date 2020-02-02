import "./App.css";
import React from "react";
import ControlPanel from "./ControlPanel";
import Display from "./Display";

class App extends React.Component {
	render() {
		return (
			<div className="app">
				<Display />
				<ControlPanel />
			</div>
		);
	}
}

export default App;
