function print(msg) {
	console.log(msg);
}

print("Hello World");

const MODEL_URL = "/models/weights";

print("Loading..");
const load = async () => {
	await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
	await faceapi.loadFaceLandmarkModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
	print("Loaded");
};

//load();

const getFaces = async img => {
	await load();
	let res = await faceapi
		.detectAllFaces(img)
		.withFaceLandmarks()
		.withFaceDescriptors();
	print(res);

	const displaySize = { width: img.width, height: img.height };
	// resize the overlay canvas to the input dimensions
	const canvas = document.getElementById("myCanvas");
	faceapi.matchDimensions(canvas, displaySize);

	res = faceapi.resizeResults(res, displaySize);
	//res = faceapi.resizeResults(res);
	print("resized");
	await faceapi.draw.drawDetections(canvas, res);
	print("detection");
	await faceapi.draw.drawFaceLandmarks(canvas, res);
	print("landmarks");
};

const img = document.getElementById("myImg");
getFaces(img);
