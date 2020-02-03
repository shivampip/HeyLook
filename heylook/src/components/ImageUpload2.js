import "./ImageUpload.css";
import React from "react";
import ImageUploader from "react-images-upload";

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = { pictures: [] };
		this.onDrop = this.onDrop.bind(this);
	}

	onDrop(picture) {
		this.props.onSelect(picture);
		console.log(picture);
		console.log("Image Dropped");
		this.setState({
			pictures: this.state.pictures.concat(picture)
		});
	}

	render() {
		return (
			<div className="image-upload">
				<p className="smileP">Select Image</p>
				<ImageUploader
					className="image-upload-view"
					withIcon={true}
					buttonText="Choose images"
					onChange={this.onDrop}
					imgExtension={[".jpg", ".png", ".gif"]}
					maxFileSize={5242880}
					withPreview="true"
					singleImage="true"
				/>
				<button className="proceedBtn">Proceed</button>
			</div>
		);
	}
}

export default ImageUpload;
