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
            let result = eval(currentOperation) || '0'; // Default to '0' if eval is undefined
            display.value = result.toString();
            addToHistory(currentOperation + ' = ' + result);
            currentOperation = '';
        }
        answerPreview.textContent = ''; // Clear the preview after calculation
    } catch (error) {
        display.value = 'Oops! Something went wrong.'; // Friendly error message
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
                answerPreview.textContent = '= ' + eval(preview) || ''; // Default to empty if eval is undefined
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
    listItem.textContent = entry;
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
