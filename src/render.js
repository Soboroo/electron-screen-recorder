const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;


async function getVideoSources() {
	await window.electronAPI.createVideoSourcesMenu();

}

let mediaRecorder;
const recordedChunks = [];
window.electronAPI.selectSource(async (_event, source) => {
	videoSelectBtn.innerText = source.name;

	const constraints = {
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: source.id
			}
		}
	};

	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	videoElement.srcObject = stream;
	videoElement.play();

	const options = { mimeType: 'video/webm; codecs=vp9' };
	mediaRecorder = new MediaRecorder(stream, options);

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.onstop = handleStop;
});

function handleDataAvailable(e) {
	console.log('video data available');
	recordedChunks.push(e.data);
}

async function handleStop(e) {
	const blob = new Blob(recordedChunks, { type: 'video/webm; codecs=vp9' });
	const buffer = await blob.arrayBuffer();
	window.electronAPI.showDialog({
		buttonLabel: 'Save video',
		defaultPath: `vid-${Date.now()}.webm`,
	}, buffer);
}

startBtn.onclick = () => {
	mediaRecorder.start();
	startBtn.classList.add('is-danger');
	startBtn.innerText = 'Recording';
};

stopBtn.onclick = () => {
	mediaRecorder.stop();
	startBtn.classList.remove('is-danger');
	startBtn.innerText = 'Start';
};