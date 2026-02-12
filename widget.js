(function () {
    // Configuration
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';
    const API_URL = isLocal
        ? "http://localhost:5000/api/chat"
        : "https://mehmaaaaaaaam-portfolio-chatbot.hf.space/api/chat";
    const THEME_COLOR = "#00e5ff";

    // Create Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .orbit-chat-widget-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 10000;
        }

        /* Custom Scrollbar */
        .orbit-chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        .orbit-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        .orbit-chat-messages::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        .orbit-chat-messages::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }

        .orbit-chat-button {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${THEME_COLOR}, #00b8cc);
            box-shadow: 0 8px 32px rgba(0, 229, 255, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 26px;
            color: white;
        }

        .orbit-chat-button:hover {
            transform: scale(1.1) rotate(5deg);
        }

        .orbit-chat-window {
            position: absolute;
            bottom: 85px;
            right: 0;
            width: 400px;
            height: 600px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            transform-origin: bottom right;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
        }

        .orbit-chat-window.open {
            display: flex;
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .orbit-chat-header {
            background: white;
            color: #0f172a;
            padding: 20px 24px;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f1f5f9;
        }

        .orbit-header-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
        }

        .orbit-online-dot {
            width: 8px;
            height: 8px;
            background: #00e5ff;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
        }

        .orbit-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            background: #ffffff;
        }

        .orbit-message {
            max-width: 88%;
            padding: 14px 18px;
            border-radius: 18px;
            font-size: 14.5px;
            line-height: 1.6;
            margin-bottom: 2px;
            position: relative;
            animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .orbit-message.bot {
            background: #f8fafc;
            color: #334155;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #f1f5f9;
        }

        .orbit-message.user {
            background: ${THEME_COLOR};
            color: #02050a;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 4px 15px rgba(0, 229, 255, 0.25);
            font-weight: 500;
        }

        /* PREMIUM MARKDOWN STYLING */
        .orbit-message p { margin: 10px 0; }
        .orbit-message p:first-child { margin-top: 0; }
        .orbit-message p:last-child { margin-bottom: 0; }
        
        .orbit-message h1, .orbit-message h2, .orbit-message h3 {
            margin: 16px 0 8px 0;
            color: #0f172a;
            font-weight: 700;
        }
        .orbit-message h3 { font-size: 16px; }

        .orbit-message.bot ol, .orbit-message.bot ul {
            padding-left: 22px;
            margin: 12px 0;
            color: #475569;
        }

        .orbit-message.bot li {
            margin-bottom: 8px;
        }

        .orbit-message strong {
            color: #0f172a;
            font-weight: 600;
        }

        .orbit-message.user strong {
            color: #fff;
        }

        .orbit-message code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 13px;
            color: ${THEME_COLOR};
        }

        .orbit-message.user code {
            background: rgba(255,255,255,0.2);
            color: white;
        }

        .orbit-typing-indicator {
            display: flex;
            padding: 12px 18px;
            background: #f8fafc;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            width: fit-content;
            gap: 5px;
            border: 1px solid #f1f5f9;
            margin-bottom: 20px;
        }

        .orbit-dot {
            width: 6px;
            height: 6px;
            background: #94a3b8;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .orbit-dot:nth-child(2) { animation-delay: 0.2s; }
        .orbit-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-7px); }
        }

        .orbit-chat-input-area {
            padding: 20px 24px;
            background: white;
            border-top: 1px solid #f1f5f9;
            display: flex;
            gap: 14px;
            align-items: center;
        }

        .orbit-chat-input {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 12px 18px;
            outline: none;
            font-size: 14px;
            transition: all 0.2s;
            background: #f8fafc;
        }

        .orbit-chat-input:focus {
            border-color: ${THEME_COLOR};
            background: white;
            box-shadow: 0 0 0 4px rgba(19, 135, 193, 0.1);
        }

        .orbit-send-btn {
            background: ${THEME_COLOR};
            border: none;
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(19, 135, 193, 0.2);
        }

        .orbit-send-btn:hover {
            background: #0d76a9;
            transform: translateY(-2px);
        }

        .orbit-send-btn:disabled {
            background: #e2e8f0;
            cursor: not-allowed;
            box-shadow: none;
        }
    `;
    document.head.appendChild(style);

    // Container
    const container = document.createElement('div');
    container.className = 'orbit-chat-widget-container';

    // Button
    const button = document.createElement('button');
    button.className = 'orbit-chat-button';
    button.innerHTML = `✉️`;

    // Window
    const windowEl = document.createElement('div');
    windowEl.className = 'orbit-chat-window';
    windowEl.innerHTML = `
        <div class="orbit-chat-header">
            <div class="orbit-header-title">
                <span class="orbit-online-dot"></span>
                <span>Mehmam AI Portfolio Assistant</span>
            </div>
            <span id="orbit-close-btn" style="cursor:pointer; font-size: 24px;">×</span>
        </div>
        <div class="orbit-chat-messages" id="orbit-messages">
            <div class="orbit-message bot">Hello! I am <strong>Syed Muhammad Mehmam's</strong> AI Portfolio Assistant. How can I help you explore his work and skills today?</div>
        </div>
        <div class="orbit-chat-input-area">
            <input class="orbit-chat-input" id="orbit-input" placeholder="Type your message..." />
            <button class="orbit-send-btn" id="orbit-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </div>
    `;

    container.appendChild(windowEl);
    container.appendChild(button);
    document.body.appendChild(container);

    // Logic
    let isOpen = false;
    const messagesEl = windowEl.querySelector('#orbit-messages');
    const inputEl = windowEl.querySelector('#orbit-input');
    const sendBtn = windowEl.querySelector('#orbit-send');
    const closeBtn = windowEl.querySelector('#orbit-close-btn');

    button.onclick = () => {
        isOpen = !isOpen;
        windowEl.classList.toggle('open', isOpen);
        if (isOpen) inputEl.focus();
    };

    closeBtn.onclick = () => {
        isOpen = false;
        windowEl.classList.remove('open');
    };

    // ✅ FIXED MESSAGE RENDERING
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `orbit-message ${sender}`;

        if (sender === 'bot') {
            if (typeof marked !== 'undefined') {
                const rawHtml = marked.parse(text);
                // Security: Sanitize HTML to prevent XSS
                div.innerHTML = typeof DOMPurify !== 'undefined'
                    ? DOMPurify.sanitize(rawHtml)
                    : rawHtml;
            } else {
                div.textContent = text;
            }
        } else {
            div.textContent = text;
        }

        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'orbit-typing-indicator';
        div.id = 'orbit-typing';
        div.innerHTML = `
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
        `;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('orbit-typing');
        if (typing) typing.remove();
    }

    // ANTI-SPAM: Cooldown logic
    let isCooldown = false;

    async function sendMessage() {
        if (isCooldown) return;
        const text = inputEl.value.trim();
        if (!text) return;

        // Security: Limit input length on frontend
        if (text.length > 500) {
            alert("Message is too long. Please shorten it.");
            return;
        }

        addMessage(text, 'user');
        inputEl.value = '';
        inputEl.disabled = true;
        sendBtn.disabled = true;
        isCooldown = true;

        showTyping();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            removeTyping();
            if (!res.ok) throw new Error();

            const data = await res.json();
            addMessage(data.response || "I apologize, but I'm having trouble retrieving that information.", 'bot');
        } catch {
            removeTyping();
            addMessage("The assistant is currently unavailable. Please try again later.", 'bot');
        } finally {
            inputEl.disabled = false;
            sendBtn.disabled = false;
            inputEl.focus();

            // Set 2s cooldown to prevent spam
            setTimeout(() => { isCooldown = false; }, 2000);
        }
    }

    sendBtn.onclick = sendMessage;
    inputEl.onkeypress = e => {
        if (e.key === 'Enter') sendMessage();
    };
    console.log("OrbitThink Chat Widget Loaded");
})();
