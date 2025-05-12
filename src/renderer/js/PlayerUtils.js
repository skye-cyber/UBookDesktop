
const btnPlayPause = document.getElementById('btn-play-pause');
const btnStop = document.getElementById('btn-stop');
const iconPlay = document.getElementById('icon-play');
const iconPaused = document.getElementById('icon-paused');
const statusLabel = document.getElementById('player-status');

const playertooltip = document.getElementById('player-tooltip');
window.playfinished = false;

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
        const status = await window.api.ReadAloud('', 'resume');

        if (status === 'Resumed') {
            statusLabel.textContent = 'Playing...';
            isPlaying = true;
            updateIcon();
        }
    } else {
        const status = await window.api.ReadAloud('', 'pause');

        if (status === "Paused") {
            statusLabel.textContent = 'Paused';
            isPlaying = false;
            updateIcon();
        }
    }
}

async function onStop() {
    statusLabel.textContent = 'Stopped';
    setTimeout(async() => {
        isPlaying = false;
        updateIcon();
        const status = await window.api.ReadAloud('', 'stop');
        status === "Stopped" ? hidePlayerTool() : '';
    }, 500)
}

btnPlayPause.addEventListener('click', onPlayPause);
btnStop.addEventListener('click', onStop);

document.addEventListener('play-finished', () => {
    // when finished, automatically reset
    isPlaying = false;
    updateIcon(); // update button/icon to reflect stopped state
    statusLabel.textContent = 'Finished'; // update status
    hidePlayerTool();

});
