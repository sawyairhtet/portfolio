function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const menuClock = document.querySelector('.menu-clock');
    if (menuClock) {
        menuClock.textContent = `${displayHours}:${minutes} ${ampm}`;
    }

    const statusTime = document.querySelector('.status-time');
    if (statusTime) {
        statusTime.textContent = `${displayHours}:${minutes}`;
    }
}

updateClock();
setInterval(updateClock, 60000);

const goBackButton = document.getElementById('go-back-btn');
if (goBackButton) {
    goBackButton.addEventListener('click', () => history.back());
}