import "./Camera.css";
import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
};

const Camera = () => {
	const webcamRef = React.useRef(null);

	const capture = React.useCallback(() => {
		console.log("Captureing..");
		const imageSrc = webcamRef.current.getScreenshot();
		console.log("Pic captured");
	}, [webcamRef]);

	return (
		<div className="camera">
			<p className="smileP">Smile Please...</p>
			<Webcam
				audio={false}
				className="cameraView"
				ref={webcamRef}
				videoConstraints={videoConstraints}
			/>
			<button className="snapBtn" onClick={capture}>
				Capture
			</button>
		</div>
	);
};

export default Camera;
