
const btnPlayPause = document.getElementById('btn-play-pause');
const btnStop = document.getElementById('btn-stop');
const iconPlay = document.getElementById('icon-play');
const iconPaused = document.getElementById('icon-paused');
const statusLabel = document.getElementById('player-status');

const playertooltip = document.getElementById('player-tooltip');
window.playfinished = false;

//window.currentAudioFile = null;

async function handleReadAloud() {
    try {
        showLoading(text = "Preparing Audio")
        const audio_file = await window.api.TTSConvert(selectedText)
        if (audio_file) {
            //window.currentAudioFile = audio_file;
            hideLoading();
            showActionToast('read');
            //start playing
            await window.ReadAloud.play(audio_file)

            displayPlayerTool();
            isPlaying = true;
            updateIcon()
            statusLabel.textContent = 'Playing...';
        }
        hideLoading();
    } catch (err) {
        hideLoading()
        console.log(err.title || err.name || err.slice(0, 100))
    }
}

let isPlaying = false;

function displayPlayerTool() {
    playertooltip.classList.remove('translate-x-[110%]')
    playertooltip.classList.add('translate-x-0')
}

function hidePlayerTool() {
    playertooltip.classList.remove('translate-x-0')
    playertooltip.classList.add('translate-x-[110%]')
}


function updateIcon() {
    if (isPlaying) {
        iconPlay.classList.add('hidden');
        iconPaused.classList.remove('hidden');
    } else {
        iconPlay.classList.remove('hidden');
        iconPaused.classList.add('hidden');
    }
}

async function onPlayPause() {
    if (!isPlaying) {
        const status = await window.ReadAloud.resume();

        if (status === 'Resumed') {
            statusLabel.textContent = 'Playing...';
            isPlaying = true;
            updateIcon();
        }
    } else {
        const status = await window.ReadAloud.pause();

        if (status === "Paused") {
            statusLabel.textContent = 'Paused';
            isPlaying = false;
            updateIcon();
        }
    }
}

async function onStop() {
    statusLabel.textContent = 'Stopped';
    setTimeout(async () => {
        isPlaying = false;
        updateIcon();
        console.log("stopping")
        const status = await window.ReadAloud.stop();
        status === "Stopped" ? hidePlayerTool() : '';
    }, 500)
}

btnPlayPause.addEventListener('click', onPlayPause);
btnStop.addEventListener('click', onStop);

document.addEventListener('play-finished', () => {
    // when finished, automatically reset
    console.log("Finished playing")
    isPlaying = false;
    updateIcon(); // update button/icon to reflect stopped state
    statusLabel.textContent = 'Finished'; // update status
    hidePlayerTool();

});

document.getElementById('btn-forward')?.addEventListener('click', seekForward)
document.getElementById('btn-backward')?.addEventListener('click', seekBackward)

async function seekForward() {
    if (isPlaying) {
        // Pause first
        const status = await window.ReadAloud.pause();

        if (status === "Paused") {
            statusLabel.textContent = 'Paused';
            isPlaying = false;
            updateIcon();
        }
    }

    const newOffset = window.ReadAloud.fastForward(5); // 5 seconds

    if (!isPlaying && newOffset) {
        isPlaying = true
        statusLabel.textContent = 'Playing...';
        updateIcon()
    }
}

async function seekBackward() {
    if (isPlaying) {
        // Pause first
        const status = await window.ReadAloud.pause();

        if (status === "Paused") {
            statusLabel.textContent = 'Paused';
            isPlaying = false;
            updateIcon();
        }
    }

    const newOffset = window.ReadAloud.rewind(5); // 5 seconds

    if (!isPlaying && newOffset) {
        isPlaying = true
        statusLabel.textContent = 'Playing...';
        updateIcon()
    }
}


const speedDown = document.getElementById('btn-speed-down')
const speedUp = document.getElementById('btn-speed-up')
const speedDisplay = document.getElementById('playback-speed')
let currentSpeed = 1.0

speedDown.addEventListener('click', (e) => {
    e.stopPropagation()
    HandleSpeed('down')
})

speedUp.addEventListener('click', (e) => {
    e.stopPropagation()
    HandleSpeed('up')
})

function HandleSpeed(direction) {
    // calculateSpeed
    if (direction === 'up') {
        currentSpeed = (currentSpeed + 0.1 <= 2) ? currentSpeed + 0.1 : 2;
    } else if (direction === 'down') {
        currentSpeed = (currentSpeed - 0.1 >= 0.5) ? currentSpeed - 0.1 : 1;
    }

    currentSpeed = currentSpeed.toFixed(1)

    // Update speed display
    speedDisplay.textContent = `${currentSpeed}x`
    adjustSpeed(currentSpeed);

    return currentSpeed
}

function adjustSpeed(value) {
    if (window.ReadAloud && typeof window.ReadAloud.setSpeed === "function") {
        window.ReadAloud.setSpeed(parseFloat(value));
    }
}
