import "./ImageUpload.css";
import React from "react";

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = { img: undefined };
	}

	handleChange = eve => {
		console.log("Picture selected");
		let file = URL.createObjectURL(eve.target.files[0]);
		this.props.onSelect(file);
	};

	render() {
		return (
			<div className="image-upload">
				<p className="smileP">Select Image</p>
				<div className="fileUpload">
					<button>Upload</button>
					<input
						className="upload"
						type="file"
						onChange={this.handleChange}
						accept="image/*"
					/>
				</div>
				{/* <img src={this.state.file} />
				<button className="proceedBtn">Proceed</button> */}
			</div>
		);
	}
}

export default ImageUpload;
