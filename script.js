const API_KEY = 'AIzaSyCXmtLwNQcN7A0IGbIhZ5NAwDT-og-3TtM'; 
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const loadingText = document.getElementById('loading-text');

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setLoading(loading) {
    sendBtn.disabled = loading;
    if (loading) {
        loadingText.classList.add('visible');
    } else {
        loadingText.classList.remove('visible');
    }
}

async function sendToGemini(text) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: text }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `Erro HTTP ${response.status}`);
        }

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Resposta vazia da API');
        }

        const botReply = data.candidates[0].content.parts[0].text;
        addMessage(botReply, 'bot');

    } catch (error) {
        console.error('Erro:', error);
        addMessage('Erro: ' + error.message, 'bot');
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    setLoading(true);

    await sendToGemini(text);

    setLoading(false);
});