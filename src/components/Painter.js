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

	getMouthMid(){
		let mouth= this.landmarks.getMouth();
		 
		let mx= mouth[18].x; //lower lips mid
		let my= mouth[18].y;

		let sx= mouth[0].x; //mouth start
		let sy= mouth[0].y;
		let ex= mouth[6].x; //mouth end 
		let ey= mouth[6].y;
		let angle = Math.atan2(ey - sy, ex - sx);
		angle= angle+ Math.PI/2;
		let distance= Math.hypot(ex- sx, ey- sy);
		return [mx, my, angle, distance];
	}

	move(x, y, angle, d){
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

		let width = rpx - lpx;
		const angle = Math.atan2(rpy - lpy, rpx - lpx);
		if (extra === -1) {
			extra = width / 5;
		}
		let llpx = extra * Math.cos(angle);
		let llpy = extra * Math.sin(angle);
		lpx = lpx - llpx;
		lpy = lpy - llpy;

		let pangle= angle+ Math.PI/2;
		llpx = extra/2 * Math.cos(pangle);
		llpy = extra/2 * Math.sin(pangle);
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
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = "#6bfffd";
		this.landmarks = landmarks;
		this.face = new FaceNormalizer(landmarks);
		this.ctx.save();
	}

	drawImg(imgSrc, x, y, angle){
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle);

	}

	putGlasses(imgSrc) {
		this.ctx.save();
		let eyes = this.face.getEyesEnds();
		let lpx = eyes[0];
		let lpy = eyes[1];
		let width = eyes[2];
		let angle = eyes[3];

		let drawing = new Image();
		drawing.src = imgSrc;

		this.ctx.translate(lpx, lpy);
		this.ctx.rotate(angle);

		drawing.onload = ()=> {
			let ratio = drawing.width / width;
			let height = drawing.height / ratio;
			this.ctx.drawImage(drawing, 0, 0, width, height);
			this.ctx.restore();
		};
	}

	putCigar(imgSrc){
		this.ctx.save();
		// this.ctx.beginPath();
		let mouth= this.face.getMouthMid();
		let x= mouth[0];
		let y= mouth[1];
		let angle= mouth[2];
		let d= mouth[4];
		d= 100;

		let pangle= angle- Math.PI/2;  

		let dm= this.face.move(x, y, pangle, d);
		let dx= dm[0];
		let dy= dm[1];

		// this.ctx.moveTo(x, y);
		// this.ctx.lineTo(dx, dy);
		// this.ctx.stroke();

		let drawing = new Image();
		drawing.src = imgSrc;

		this.ctx.translate(dx, dy);
		this.ctx.rotate(-pangle);
		//this.ctx.rotate(angle);

		drawing.onload = ()=> {
			let ratio = drawing.width / d;
			let height = drawing.height / ratio;
			this.ctx.drawImage(drawing, 0, 0, d, height);
			this.ctx.restore();
		};

	}

	drawMouthMid(){
		let mouth= this.face.getMouthMid();
		let x= mouth[0];
		let y= mouth[1];
		let angle= mouth[2];

		let dm= this.face.move(x, y, angle, 50);
		let dx= dm[0];
		let dy= dm[1];

		this.ctx.beginPath();
		this.ctx.moveTo(x,y);
		this.ctx.lineTo(dx, dy);
		this.ctx.stroke();
	}

}
