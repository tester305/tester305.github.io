(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const executeButton = document.getElementById('executeButton');
const clearButton = document.getElementById('clearButton');

let commandHistory = [];
let historyIndex = -1;

clearButton.addEventListener('click', () => {
    terminalOutput.innerHTML = '';
});

executeButton.addEventListener('click', async () => {
    const code = terminalInput.value;

    if (code.trim() === "") {
        return;
    }
    terminalOutput.innerHTML += `<span class="command">> ${code}</span><br>`;
    commandHistory.push(code);
    historyIndex = commandHistory.length;
    terminalInput.value = "";

    if (code.trim() === "neofetch") {
        console.log('Executing neofetch...');
        const neofetchOutput = await neofetch();
        console.log('neofetch output:', neofetchOutput);
        terminalOutput.innerHTML += `${neofetchOutput}<br>`;
    } else {
        try {
            const result = eval(code);
            terminalOutput.innerHTML += `${result}<br>`;
        } catch (error) {
            terminalOutput.innerHTML += `<span class="error">Error: ${error.message}</span></br>`;
        }
    }
});

async function neofetch() {
    console.log('neofetch function called');

    try {
        // Update the URL to point to your Vercel deployment
        const response = await fetch('https://nicecalc.vercel.app/api/neofetch');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const { osInfo, cpu, mem, user, graphics } = data;

        console.log('osInfo:', osInfo);
        console.log('cpu:', cpu);
        console.log('mem:', mem);
        console.log('user:', user);
        console.log('graphics:', graphics);

        // Extract GPU information
        const gpuInfo = graphics.controllers.map(controller => controller.model).join(', ');

        return `
            <pre>
            ${asciiArt()}
            user@${osInfo.hostname}
            --------------
            OS: ${osInfo.distro}
            Kernel: ${osInfo.kernel}
            Uptime: ${osInfo.uptime}
            Packages: N/A
            Shell: ${user.length > 0 ? user[0].tty : 'N/A'}
            Resolution: ${window.screen.width}x${window.screen.height}
            DE: N/A
            WM: N/A
            WM Theme: N/A
            Theme: N/A
            Icons: N/A
            Terminal: N/A
            CPU: ${cpu.manufacturer} ${cpu.brand}
            GPU: ${gpuInfo}
            Memory: ${(mem.total / (1024 ** 3)).toFixed(2)} GB
            </pre>
        `;
    } catch (error) {
        console.error('Error fetching system information:', error);
        return `<pre>Error: ${error.message}</pre>`;
    }
}

function asciiArt() {
    return `
        _________
       /         \\
      /           \\
     /             \\
    /      JS       \\
    \\               /
     \\             /
      \\           /
       \\_________/
    `;
}

window.neofetch = neofetch; // Expose neofetch to the global scope

terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = ''; // Clear the input when you reach the beginning
        }
    }
});
},{}]},{},[1]);
