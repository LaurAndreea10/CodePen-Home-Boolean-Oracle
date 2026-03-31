const oracle = document.querySelector(".oracle");
const app = document.querySelector(".app");

const stateText = document.querySelector(".state-text");
const modeValue = document.querySelector(".mode-value");
const stabilityValue = document.querySelector(".stability-value");
const messageValue = document.querySelector(".message-value");
const coreSymbol = document.querySelector(".core-symbol");

const buttons = document.querySelectorAll(".verdict-btn");
const runButton = document.querySelector(".run-verdict");

const burst = document.querySelector(".burst");
const bootSequence = document.querySelector(".boot-sequence");
const bootStatus = document.querySelector(".boot-status span");

const states = {
	true: {
		mode: "TRUE",
		stability: "100%",
		message: "REALITY VERIFIED",
		symbol: "T"
	},
	false: {
		mode: "FALSE",
		stability: "13%",
		message: "SIMULATION CORRUPTED",
		symbol: "F"
	}
};

let selectedState = "true";
let isBusy = false;

function triggerFlash() {
	oracle.classList.remove("is-flashing");
	void oracle.offsetWidth;
	oracle.classList.add("is-flashing");
}

function triggerShake() {
	oracle.classList.remove("is-shaking");
	void oracle.offsetWidth;
	oracle.classList.add("is-shaking");
}

function createBurst(type) {
	const count = type === "false" ? 28 : 16;
	burst.innerHTML = "";

	for (let i = 0; i < count; i += 1) {
		const particle = document.createElement("span");
		const angle = `${(360 / count) * i}deg`;
		const distance =
			type === "false"
				? `${165 + Math.random() * 120}px`
				: `${110 + Math.random() * 70}px`;

		const size = `${6 + Math.random() * 10}px`;
		const duration = `${0.55 + Math.random() * 0.55}s`;

		particle.className = `burst-particle ${type}`;
		particle.style.setProperty("--angle", angle);
		particle.style.setProperty("--distance", distance);
		particle.style.width = size;
		particle.style.height = size;
		particle.style.animationDuration = duration;

		burst.appendChild(particle);
	}

	window.setTimeout(() => {
		burst.innerHTML = "";
	}, 1100);
}

function updateReadout(nextState) {
	const data = states[nextState];

	oracle.dataset.state = nextState;
	stateText.textContent = data.mode;
	modeValue.textContent = data.mode;
	stabilityValue.textContent = data.stability;
	messageValue.textContent = data.message;
	coreSymbol.textContent = data.symbol;
}

function syncSelectedButtons() {
	buttons.forEach((btn) => {
		btn.classList.toggle("is-active", btn.dataset.set === selectedState);
	});
}

function applyState(nextState) {
	updateReadout(nextState);
	syncSelectedButtons();

	triggerFlash();
	createBurst(nextState);

	if (nextState === "false") {
		triggerShake();
	}
}

function setSelectedState(nextState) {
	selectedState = nextState;
	syncSelectedButtons();
}

function runVerdict() {
	if (isBusy || oracle.classList.contains("is-locked")) return;

	isBusy = true;
	oracle.classList.add("is-running");

	stateText.textContent = "SCAN";
	modeValue.textContent = "SCAN";
	stabilityValue.textContent = "--";
	messageValue.textContent = "EVALUATING BOOLEAN POSSIBILITY";
	coreSymbol.textContent = "?";

	triggerFlash();
	createBurst("true");

	window.setTimeout(() => {
		stateText.textContent = "READ";
		modeValue.textContent = "READ";
		stabilityValue.textContent = "??";
		messageValue.textContent = "TRUTH MATRIX IN PROGRESS";
		coreSymbol.textContent = "…";
		triggerFlash();

		if (selectedState === "false") {
			triggerShake();
			createBurst("false");
		}
	}, 450);

	window.setTimeout(() => {
		applyState(selectedState);
		oracle.classList.remove("is-running");
		isBusy = false;
	}, 1200);
}

function runIntro() {
	oracle.classList.add("is-locked", "is-booting");
	applyState("true");

	window.setTimeout(() => {
		bootStatus.textContent = "SCANNING";
		applyState("false");
	}, 850);

	window.setTimeout(() => {
		bootStatus.textContent = "STABILIZING";
		applyState("true");
	}, 1550);

	window.setTimeout(() => {
		bootStatus.textContent = "ONLINE";
		oracle.classList.remove("is-booting");
	}, 2050);

	window.setTimeout(() => {
		bootSequence.classList.add("is-hidden");
		oracle.classList.remove("is-locked");
		setSelectedState("true");
	}, 2400);
}

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		if (oracle.classList.contains("is-locked") || isBusy) return;
		setSelectedState(button.dataset.set);
	});
});

runButton.addEventListener("click", runVerdict);

document.addEventListener("keydown", (event) => {
	if (oracle.classList.contains("is-locked") || isBusy) return;

	const key = event.key.toLowerCase();

	if (key === "t") {
		setSelectedState("true");
	}

	if (key === "f") {
		setSelectedState("false");
	}

	if (key === " " || key === "enter") {
		event.preventDefault();
		runVerdict();
	}
});

app.addEventListener("pointermove", (event) => {
	const rect = oracle.getBoundingClientRect();
	const x = event.clientX - rect.left - rect.width / 2;
	const y = event.clientY - rect.top - rect.height / 2;

	const mx = x / rect.width;
	const my = y / rect.height;

	document.documentElement.style.setProperty("--mx", `${mx * 18}px`);
	document.documentElement.style.setProperty("--my", `${my * 18}px`);
	document.documentElement.style.setProperty("--tiltY", `${mx * 6}deg`);
	document.documentElement.style.setProperty("--tiltX", `${my * -6}deg`);
});

app.addEventListener("pointerleave", () => {
	document.documentElement.style.setProperty("--mx", "0px");
	document.documentElement.style.setProperty("--my", "0px");
	document.documentElement.style.setProperty("--tiltY", "0deg");
	document.documentElement.style.setProperty("--tiltX", "0deg");
});

setSelectedState("true");
applyState("true");
runIntro();
