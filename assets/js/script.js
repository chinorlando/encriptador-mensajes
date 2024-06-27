const inputText = document.querySelector('.input-section textarea');
const outputText = document.getElementById('output');
const encryptButton = document.querySelector('.encrypt');
const decryptButton = document.querySelector('.decrypt');
const noMessageDiv = document.getElementById('no-message');
const copyButton = document.getElementById('copyButton');
const notification = document.getElementById('notification');

const encryptRules = {
    'e': 'enter',
    'i': 'imes',
    'a': 'ai',
    'o': 'ober',
    'u': 'ufat'
};

function encrypt(text) {
    inputText.value = '';
    return text.replace(/[aeiou]/g, letter => encryptRules[letter]);
}

function decrypt(text) {
    let decrypted = text;
    inputText.value = '';
    Object.entries(encryptRules).forEach(([key, value]) => {
        decrypted = decrypted.replace(new RegExp(value, 'g'), key);
    });
    return decrypted;
}

function showResult(text) {
    if (text) {
        outputText.value = text;
        outputText.style.display = 'block';
        noMessageDiv.style.display = 'none';
        copyButton.style.display = 'inline-block';
    } else {
        outputText.style.display = 'none';
        noMessageDiv.style.display = 'block';
        copyButton.style.display = 'none';
    }
}

encryptButton.addEventListener('click', () => {
    const text = inputText.value.toLowerCase();
    showResult(encrypt(text));
});

decryptButton.addEventListener('click', () => {
    const text = inputText.value;
    showResult(decrypt(text));
});

inputText.addEventListener('input', () => {
    if (!inputText.value.trim()) {
        showResult('');
    }
});

const validateInput = () => {
    const invalidChar = /[^a-z0-9\s]/g;
    if (invalidChar.test(inputText.value)) {
        noMessageDiv.classList.add('warning');
    } else {
        noMessageDiv.classList.remove('warning');
    }
    inputText.value = inputText.value.replace(invalidChar, '');
};

inputText.addEventListener('input', validateInput);

inputText.addEventListener('keydown', event => {
    const invalidChar = /[^a-z0-9\s]/g;
    if (event.key === 'Backspace' || event.key === 'F5') {
        return;
    } else if (invalidChar.test(event.key)) {
        event.preventDefault();
    }
    
    if (event.key === 'Enter') {
        event.preventDefault();
        const text = inputText.value.toLowerCase();
        showResult(encrypt(text));
        inputText.select();
    }

    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        const text = inputText.value;
        showResult(decrypt(text));
        inputText.select();
    }
});

inputText.addEventListener('focus', () => {
    inputText.select();
});

copyButton.addEventListener('click', async () => {
    try {
        outputText.select();
        await navigator.clipboard.writeText(outputText.value);
        showNotification('Texto copiado al portapapeles');
    } catch (err) {
        showNotification('Error al copiar al portapapeles');
    }
});

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}