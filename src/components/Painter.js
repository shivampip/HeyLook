export const paint = () => {
	console.log("Painting....");
};

// (0, 0) at top-left
// horizontal x, vertical y
// Angle clockwise

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

	getMouthMid() {
		let mouth = this.landmarks.getMouth();

		let mx = mouth[18].x; //lower lips mid
		let my = mouth[18].y;

		let sx = mouth[0].x; //mouth start
		let sy = mouth[0].y;
		let ex = mouth[6].x; //mouth end
		let ey = mouth[6].y;
		let angle = Math.atan2(ey - sy, ex - sx);
		angle = angle + Math.PI / 2;
		let distance = Math.hypot(ex - sx, ey - sy);
		return [mx, my, angle, distance];
	}

	move(x, y, angle, d) {
		let dx = d * Math.cos(angle);
		let dy = d * Math.sin(angle);
		let xx = x - dx;
		let yy = y - dy;
		return [xx, yy];
	}

	getEyesEnds(extra = -1) {
		let leftEye = this.landmarks.getLeftEye();
		let rightEye = this.landmarks.getRightEye();

		let lpx = leftEye[0].x;
		let lpy = leftEye[0].y;
		let rpx = rightEye[3].x;
		let rpy = rightEye[3].y;

		//let width = rpx - lpx;
		let width = Math.hypot(rpx - lpx, rpy - lpy);
		const angle = Math.atan2(rpy - lpy, rpx - lpx);
		if (extra === -1) {
			extra = width / 4;
		}
		let llpx = extra * Math.cos(angle);
		let llpy = extra * Math.sin(angle);
		lpx = lpx - llpx;
		lpy = lpy - llpy;

		let pangle = angle + Math.PI / 2;
		llpx = (extra / 4) * Math.cos(pangle);
		llpy = (extra / 4) * Math.sin(pangle);
		lpx = lpx - llpx;
		lpy = lpy - llpy;

		width = width + extra * 2;
		return [lpx, lpy, width, angle];
	}

	getNeck() {
		let jaw = this.landmarks.getJawOutline();
		let sx = jaw[6].x;
		let sy = jaw[6].y;
		let dx = jaw[11].x;
		let dy = jaw[11].y;

		let distance = Math.hypot(dx - sx, dy - sy);
		const angle = Math.atan2(dy - sy, dx - sx);
		return [sx, sy, distance, angle, dx, dy];
	}
}

export class FacePainter {
	constructor(img, canvas, landmarks) {
		this.img = img;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = "#6bfffd";
		this.ctx.fillStyle = "#6bfffd";
		this.landmarks = landmarks;
		this.face = new FaceNormalizer(landmarks);
		this.ctx.save();
		this.debug = true;
	}

	dot(x, y, color = "#6bfffd") {
		if (this.debug) {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, 5, 5);
		}
	}

	drawImage = async (drawing, width, x, y, angle) => {
		this.ctx.resetTransform();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle);

		return new Promise((resolve, reject) => {
			drawing.onload = async () => {
				let ratio = drawing.width / width;
				let height = drawing.height / ratio;
				await this.ctx.drawImage(drawing, 0, 0, width, height);
				this.ctx.restore();
				resolve(true);
			};
		});
	};

	async putGlasses(imgSrc, debug = true) {
		this.debug = debug;
		this.ctx.save();
		let eyes = this.face.getEyesEnds();
		let lpx = eyes[0];
		let lpy = eyes[1];
		let width = eyes[2];
		let angle = eyes[3];

		let drawing = new Image();
		drawing.src = imgSrc;

		this.dot(lpx, lpy);

		await this.drawImage(drawing, width, lpx, lpy, angle);
	}

	async putCigar(imgSrc, debug = true) {
		this.debug = debug;
		this.ctx.save();
		let mouth = this.face.getMouthMid();
		let x = mouth[0];
		let y = mouth[1];
		let angle = mouth[2];
		let d = mouth[3];
		d = d + d / 2;

		let pangle = angle - Math.PI / 2;

		let dm = this.face.move(x, y, pangle, d);
		let dx = dm[0];
		let dy = dm[1];

		this.dot(x, y);
		this.dot(dx, dy);

		let drawing = new Image();
		drawing.src = imgSrc;

		let nangle = Math.atan2(y - dy, x - dx);

		await this.drawImage(drawing, d, dx, dy, nangle);
	}

	async putChain(imgSrc, debug = true) {
		this.debug = debug;
		this.ctx.save();
		let neck = this.face.getNeck();
		let x = neck[0];
		let y = neck[1];
		let width = neck[2];
		let angle = neck[3];
		let xx = neck[4];
		let yy = neck[5];

		this.dot(x, y, "yellow");
		this.dot(xx, yy, "yellow");

		let extra = 2.5;
		let dm = this.face.move(x, y, angle, width / extra);
		let dx = dm[0];
		let dy = dm[1];
		width = width + (2 * width) / extra;

		this.dot(dx, dy, "yellow");

		let drawing = new Image();
		drawing.src = imgSrc;

		await this.drawImage(drawing, width, dx, dy, angle);
	}
}
