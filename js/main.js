// Z-Index Management
let highestZ = 100;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// Open/Close Logic
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
    }
}

// Draggable Logic
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');

    if (header) {
        // if present, the header is where you move the DIV from:
        header.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Bring to front when dragging starts
        bringToFront(element);

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Make all windows draggable
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        makeDraggable(win);
        
        // Also add click listener to body to bring to front even if not dragging
        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
    });

    // Mobile Check (Optional extra enforcement)
    function checkMobile() {
        if (window.innerWidth < 768) {
            const warning = document.getElementById('mobile-warning');
            const desktop = document.getElementById('desktop');
            if (warning) warning.style.display = 'flex';
            if (desktop) desktop.style.display = 'none';
        } else {
            const warning = document.getElementById('mobile-warning');
            const desktop = document.getElementById('desktop');
            if (warning) warning.style.display = 'none';
            if (desktop) desktop.style.display = 'block';
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile(); // Run on load
});
