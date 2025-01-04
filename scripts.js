let display = document.getElementById('display');
let answerPreview = document.getElementById('answer-preview');
let currentOperation = '';
let concatMode = false;
let memory = 0; // Memory storage
let history = []; // History storage

function appendNumber(number) {
    if (display.value === '0' || concatMode) {
        display.value = number;
    } else {
        display.value += number;
    }
    updatePreview();
}

function appendDecimal() {
    if (!display.value.includes('.')) {
        display.value += '.';
    }
    updatePreview();
}

function operate(operator) {
    if (display.value) {
        if (concatMode) {
            currentOperation += display.value;
            display.value = operator;
        } else {
            currentOperation += display.value + ' ' + operator + ' ';
            display.value = '';
        }
        updatePreview();
    }
}

function calculate() {
    try {
        if (concatMode) {
            display.value = currentOperation + display.value;
            currentOperation = ''; // Clear currentOperation after displaying the result
        } else {
            currentOperation += display.value;
            if (currentOperation.includes('/ 0')) {
                throw new Error("Numbers can't be divided by 0!");
            }
            let result = eval(currentOperation.replace(/×/g, '*').replace(/÷/g, '/')) || '0'; // Replace symbols with actual operators
            display.value = result.toString();
            addToHistory(currentOperation + ' = ' + result);
            currentOperation = '';
        }
        answerPreview.textContent = ''; // Clear the preview after calculation
    } catch (error) {
        display.value = error.message || 'Oops! Something went wrong.'; // Friendly error message
        currentOperation = '';
        answerPreview.textContent = '';
    }
}

function clearDisplay() {
    display.value = '';
    currentOperation = '';
    answerPreview.textContent = '';
}

function updatePreview() {
    try {
        let preview = currentOperation + display.value;
        if (concatMode) {
            answerPreview.textContent = preview; // Show concatenation result
        } else {
            if (preview) {
                if (preview.includes('/ 0')) {
                    answerPreview.textContent = "Numbers can't be divided by 0!";
                } else {
                    answerPreview.textContent = '= ' + eval(preview.replace(/×/g, '*').replace(/÷/g, '/')) || ''; // Replace symbols with actual operators
                }
            } else {
                answerPreview.textContent = '';
            }
        }
    } catch (error) {
        answerPreview.textContent = 'Oops! Something went wrong.'; // Friendly error message
    }
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
}

function toggleSettings() {
    document.getElementById('settings').classList.toggle('hidden');
}

function toggleConcatMode() {
    concatMode = !concatMode;
    clearDisplay(); // Clear the display when switching modes to avoid confusion
}

// Memory functions
function memoryAdd() {
    memory += parseFloat(display.value) || 0;
    clearDisplay();
}

function memorySubtract() {
    memory -= parseFloat(display.value) || 0;
    clearDisplay();
}

function memoryRecall() {
    display.value = memory.toString();
    updatePreview();
}

function memoryClear() {
    memory = 0;
    clearDisplay();
}

function addToHistory(entry) {
    history.push(entry);
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = entry.replace(/\*/g, '×').replace(/\//g, '÷'); // Replace * with × and / with ÷ for display
    historyList.appendChild(listItem);
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (!isNaN(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        operate(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace' || key.toUpperCase() === 'C') {
        clearDisplay();
    }
});

// Scientific functions
function squareRoot() {
    if (display.value) {
        display.value = Math.sqrt(parseFloat(display.value)).toString();
        updatePreview();
    }
}

function exponent() {
    if (display.value) {
        currentOperation += display.value + ' ** ';
        display.value = '';
        updatePreview();
    }
}

function log() {
    if (display.value) {
        display.value = Math.log10(parseFloat(display.value)).toString();
        updatePreview();
    }
}

function trigFunction(func) {
    if (display.value) {
        let value = parseFloat(display.value);
        switch (func) {
            case 'sin':
                display.value = Math.sin(value).toString();
                break;
            case 'cos':
                display.value = Math.cos(value).toString();
                break;
            case 'tan':
                display.value = Math.tan(value).toString();
                break;
        }
        updatePreview();
    }
}

// Notification functions
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('visible');

    // Automatically hide after 10 seconds
    setTimeout(() => {
        if (notification.classList.contains('visible')) {
            notification.classList.remove('visible');
        }
    }, 10000);

    // Add swipe functionality
    let startX = 0;
    notification.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    notification.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const change = startX - touch.clientX;
        if (change > 0) {
            notification.style.transform = `translateX(-${change}px)`;
        }
    });

    notification.addEventListener('touchend', (e) => {
        const change = startX - e.changedTouches[0].clientX;
        if (change > 100) {
            notification.classList.add('swiped');
            setTimeout(() => {
                notification.classList.remove('visible', 'swiped');
                notification.style.transform = '';
            }, 300);
        } else {
            notification.style.transform = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', showNotification);
