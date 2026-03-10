// --- APP NAVIGATION ---
function switchApp(el) {
    document.querySelectorAll('.icon-btn').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    // Switch app section
    const title = el.getAttribute('title');
    const sections = {
        'Identity': 'app-identity',
        'Labs': 'app-labs',
        'Records': 'app-records',
        'Targets': 'app-targets',
        'Settings': 'app-settings'
    };
    Object.values(sections).forEach(id => {
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'none';
    });
    if (sections[title]) {
        document.getElementById(sections[title]).style.display = '';
    }
    // Default to Records if not found
    if (!sections[title]) {
        document.getElementById('app-records').style.display = '';
    }
}
}

// --- FILE MANAGEMENT ---
function selectNotebook(el) {
    document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    
    const fileName = el.childNodes[0].textContent.trim();
    const docTitle = document.getElementById('doc-title');
    
    if (docTitle) {
        // Typewriter effect for title change
        docTitle.textContent = '';
        let i = 0;
        const speed = 50;
        
        function typeWriter() {
            if (i < fileName.length) {
                docTitle.textContent += fileName.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    }
}

function addNewFile() {
    const fileName = prompt("Enter new file designation:");
    
    if (fileName && fileName.trim() !== "") {
        const ul = document.getElementById('document-list');
        const li = document.createElement('li');
        li.className = 'file-item';
        li.setAttribute('onclick', 'selectNotebook(this)');
        
        const today = new Date().toISOString().split('T')[0];
        li.innerHTML = `${fileName.trim()} <span class="file-date">${today}</span>`;
        
        ul.insertBefore(li, ul.firstChild);
        selectNotebook(li);
    }
}

// --- EDITOR & CANVAS CONTROLS ---
function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    document.getElementById('active-page').focus();
}

function changePaper(pattern) {
    const page = document.getElementById('active-page');
    page.classList.remove('paper-grid', 'paper-dots', 'paper-lines', 'paper-blank');
    page.classList.add(`paper-${pattern}`);
}

function changeCanvas(mode) {
    const stage = document.getElementById('main-container');
    stage.classList.remove('canvas-default', 'canvas-tinted', 'canvas-blueprint');
    stage.classList.add(mode);
}

function triggerGlitch() {
    const title = document.getElementById('doc-title');
    title.classList.add('glitch-anim');
    setTimeout(() => {
        title.classList.remove('glitch-anim');
    }, 800); // Glitch lasts 0.8s
}

// --- ASSET & STICKER SYSTEM ---
function toggleAssets() {
    const drawer = document.getElementById('asset-drawer');
    drawer.classList.toggle('open');
}

function addSticker(type) {
    const layer = document.getElementById('sticker-layer');
    const sticker = document.createElement('div');
    sticker.className = 'draggable-sticker';
    
    // Random spawn position and rotation
    const randomX = Math.floor(Math.random() * 100) + 50;
    const randomY = Math.floor(Math.random() * 100) + 100;
    
    // Only rotate stamps and tape, keep notes straight
    let rotation = 0;
    if (!type.includes('note') && !type.includes('icon')) {
        rotation = Math.floor(Math.random() * 40) - 20; // -20deg to +20deg
    }
    
    sticker.style.left = randomX + 'px';
    sticker.style.top = randomY + 'px';
    sticker.style.transform = `rotate(${rotation}deg)`;
    
    let content = '';
    switch(type) {
        case 'stamp-top-secret':
            content = '<div class="stamp-secret">TOP SECRET</div>';
            break;
        case 'stamp-approved':
            content = '<div class="stamp-approved">APPROVED</div>';
            break;
        case 'tape-warning':
            content = '<div class="tape-warning">WARNING // CAUTION // HAZARD</div>';
            break;
        case 'icon-bio':
            content = '<i class="fa-solid fa-biohazard" style="font-size:4rem; color:#ccff00;"></i>';
            break;
        case 'icon-rad':
            content = '<i class="fa-solid fa-radiation" style="font-size:4rem; color:#ffaa00;"></i>';
            break;
        case 'note-yellow':
            content = '<div style="width:150px; height:150px; background:#ffeb3b; padding:10px; color:#000; font-family:monospace; box-shadow:3px 3px 10px rgba(0,0,0,0.5);" contenteditable="true">Note...</div>';
            break;
        case 'note-pink':
            content = '<div style="width:150px; height:150px; background:#ff4081; padding:10px; color:#fff; font-family:monospace; box-shadow:3px 3px 10px rgba(0,0,0,0.5);" contenteditable="true">Note...</div>';
            break;
        case 'svg-cyber-skull':
            content = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="32" stroke="#ff00ff" stroke-width="4" fill="#1a0033"/><ellipse cx="35" cy="40" rx="18" ry="15" fill="#2d004d" stroke="#ff5afd" stroke-width="2"/><ellipse cx="27" cy="38" rx="3" ry="5" fill="#fff"/><ellipse cx="43" cy="38" rx="3" ry="5" fill="#fff"/><rect x="30" y="50" width="10" height="6" rx="2" fill="#ff00ff"/><rect x="32" y="56" width="6" height="4" rx="1" fill="#ffe156"/></svg>`;
            break;
        case 'svg-cyber-chip':
            content = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="40" height="40" rx="8" fill="#181200" stroke="#ffb300" stroke-width="3"/><rect x="25" y="25" width="20" height="20" rx="4" fill="#ffb300"/><rect x="32" y="32" width="6" height="6" rx="1" fill="#181200"/><line x1="35" y1="15" x2="35" y2="5" stroke="#ffb300" stroke-width="2"/><line x1="35" y1="65" x2="35" y2="55" stroke="#ffb300" stroke-width="2"/><line x1="15" y1="35" x2="5" y2="35" stroke="#ffb300" stroke-width="2"/><line x1="65" y1="35" x2="55" y2="35" stroke="#ffb300" stroke-width="2"/></svg>`;
            break;
        case 'svg-cyber-eye':
            content = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="35" cy="35" rx="28" ry="18" fill="#fff0f5" stroke="#ff69b4" stroke-width="3"/><ellipse cx="35" cy="35" rx="12" ry="12" fill="#ff69b4"/><circle cx="35" cy="35" r="6" fill="#fff"/><circle cx="37" cy="33" r="2" fill="#ffb7c5"/></svg>`;
            break;
    }
    
    sticker.innerHTML = content + '<div class="delete-handle" onclick="this.parentElement.remove()" title="Remove"><i class="fa-solid fa-xmark"></i></div>';
    layer.appendChild(sticker);
    initDrag(sticker);
}

function initDrag(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.getAttribute('contenteditable') === 'true' || e.target.closest('.delete-handle')) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Bring to front
        document.querySelectorAll('.draggable-sticker').forEach(s => s.style.zIndex = 1);
        element.style.zIndex = 10;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- INTERACTIVE TERMINAL ---
function handleTerminal(e) {
    if (e.key === 'Enter') {
        const inputEl = document.getElementById('term-input');
        const outputEl = document.getElementById('terminal-output');
        const command = inputEl.value.trim().toLowerCase();
        
        if(command === "") return;
        
        // Echo command
        outputEl.innerHTML += `<div class="log-line">${command}</div>`;
        inputEl.value = ''; // Clear input
        
        // Process Command
        setTimeout(() => {
            let response = '';
            let className = '';
            
            switch(command) {
                case 'help':
                    response = "AVAILABLE COMMANDS: scan, hack, clear, status";
                    break;
                case 'clear':
                    outputEl.innerHTML = '';
                    return;
                case 'scan':
                    response = "SCANNING LOCAL NETWORK... 3 ANOMALIES DETECTED.";
                    className = "log-error";
                    break;
                case 'hack':
                    response = "BYPASSING ICE... ACCESS GRANTED TO SECTOR 4.";
                    className = "log-success";
                    break;
                case 'status':
                    response = "SYSTEM OPTIMAL. UPLINK SECURE.";
                    className = "log-success";
                    break;
                default:
                    response = `COMMAND NOT RECOGNIZED: '${command}'`;
                    className = "log-error";
            }
            
            outputEl.innerHTML += `<div class="log-line ${className}">${response}</div>`;
            outputEl.scrollTop = outputEl.scrollHeight; // Auto-scroll to bottom
        }, 400); // Slight delay for "processing" feel
    }
}