export const paint = () => {
	console.log("Painting....");
};

class FaceNormalizer {
	constructor(landmarks) {
		this.landmarks = landmarks;
	}

	getNose() {
		return this.landmarks.getNose();
	}

	getEyes() {
		let leftEye = this.landmarks.getLeftEye();
		let rightEye = this.landmarks.getRightEye();
		return [leftEye, rightEye];
	}

	getEyesEnds(extra = -1) {
		let leftEye = this.landmarks.getLeftEye();
		let rightEye = this.landmarks.getRightEye();

		let lpx = leftEye[0].x;
		let lpy = leftEye[0].y;
		let rpx = rightEye[3].x;
		let rpy = rightEye[3].y;

		let width = rpx - lpx;
		const angle = Math.atan2(rpy - lpy, rpx - lpx);
		if (extra === -1) {
			extra = width / 5;
		}
		let llpx = extra * Math.cos(angle);
		let llpy = extra * Math.sin(angle);
		lpx = lpx - llpx;
		lpy = lpy - llpy;
		width = width + extra * 2;
		return [lpx, lpy, width, angle];
	}
}

export class FacePainter {
	constructor(img, canvas, landmarks) {
		this.img = img;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.landmarks = landmarks;
		this.face = new FaceNormalizer(landmarks);
	}

	putGlasses(imgSrc) {
		let eyes = this.face.getEyesEnds();
		let lpx = eyes[0];
		let lpy = eyes[1];
		let width = eyes[2];
		let angle = eyes[3];

		let drawing = new Image();
		drawing.src = imgSrc;

		this.ctx.translate(lpx, lpy);
		this.ctx.rotate(angle);

		drawing.onload = function() {
			let ratio = drawing.width / width;
			let height = drawing.height / ratio;
			this.ctx.drawImage(drawing, 0, 0, width, height);

			this.ctx.rotate(-angle);
			this.ctx.translate(0, 0);
		};
	}
}
