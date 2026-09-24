chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertMessage') {
        insertMessageIntoComposer(request.message);
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'getTicketContext') {
        getTicketContext()
            .then((context) => {
                sendResponse({ success: true, context: context });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }

    return true;
});

function insertMessageIntoComposer(message) {
    message = message
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');

    message = markdownToPlainText(message);

    const sendButton = document.querySelector('.o-mail-Chatter-sendMessage.btn');
    const isEditor = document.querySelector('.o-mail-Composer-input.o-mail-Composer-bg');

    if (sendButton && !isEditor) {
        sendButton.click();
    }

    setTimeout(() => {
        const editor = document.querySelector('.o-mail-Composer-input.o-mail-Composer-bg');
        if (!editor) {
            console.log('Odoo Tech Support: Composer not found');
            return;
        }

        editor.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        document.execCommand('insertText', false, message);
        editor.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            inputType: 'insertText',
            data: message
        }));
    }, 300);
}


function getEditorText(editor) {
    if (!editor) return '';
    if (typeof editor.value === 'string') return editor.value;
    return editor.textContent || '';
}

function findEditorNear(element) {
    const root = (element && element.closest)
        ? (element.closest('.modal') || element.closest('.wysiwyg-local-overlay') || document)
        : document;

    return root.querySelector('.o-mail-Composer-input.o-mail-Composer-bg')
        || root.querySelector('.o-mail-Composer-input')
        || root.querySelector('textarea:not([readonly]):not([disabled])')
        || root.querySelector('[contenteditable="true"]')
        || document.querySelector('.o-mail-Composer-input.o-mail-Composer-bg')
        || document.querySelector('.wysiwyg-local-overlay textarea')
        || document.querySelector('.wysiwyg-local-overlay [contenteditable="true"]');
}

function addTranslateButton() {
    const quickActions = document.querySelector('.o-mail-Composer-quickActions');
    if (!quickActions) return;
    const actionList = quickActions.querySelector('.o-mail-ActionList');
    if (!actionList) return;

    if (!actionList.querySelector('.tech-support-translate-btn')) {
        const translateButton = document.createElement('button');
        translateButton.type = 'button';
        translateButton.className = 'tech-support-translate-btn o-mail-ActionList-button btn btn-group-item position-relative o-inline btn-secondary d-flex align-items-center border-0 rounded-circle';
        translateButton.setAttribute('aria-label', 'Translate Message');
        translateButton.setAttribute('title', 'Translate Message');
        translateButton.innerHTML = `<i class="fa fa-language fa-fw"></i>`;
        translateButton.style.width = '32px';
        translateButton.style.height = '32px';
        translateButton.style.marginLeft = '3px';
        translateButton.style.cursor = 'pointer';
        translateButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openTranslateMenu(translateButton);
        });
        actionList.appendChild(translateButton);
    }
}


const translationLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' }
];

function openTranslateMenu(button) {
    const oldMenu = document.querySelector('.tech-support-translate-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'tech-support-translate-menu';
    menu.innerHTML = `
        <div class="tech-translate-title">Translate &amp; Rewrite message</div>
        <select class="tech-translate-language">
            <option value="">Select a language...</option>
        </select>
        <label class="tech-translate-multilingual">
            <input type="checkbox" class="tech-multilingual-check"> Multilingual — include original version
        </label>
        <button type="button" class="tech-translate-submit">Translate &amp; Rewrite</button>
        <div class="tech-translate-status"></div>
    `;

    menu.style.position = 'fixed';
    menu.style.zIndex = '999999';
    menu.style.background = '#1B1D26';
    menu.style.border = '1px solid #3C3E4B';
    menu.style.borderRadius = '8px';
    menu.style.padding = '12px';
    menu.style.width = '340px';
    menu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';

    const title = menu.querySelector('.tech-translate-title');
    title.style.fontSize = '13px';
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';
    title.style.color = '#E4E4E4';

    const select = menu.querySelector('.tech-translate-language');
    select.style.width = '100%';
    select.style.padding = '7px';
    select.style.border = '1px solid #3C3E4B';
    select.style.background = '#262A36';
    select.style.color = '#E4E4E4';
    select.style.borderRadius = '5px';
    select.style.marginBottom = '8px';
    select.style.fontSize = '13px';

    const multilingualLabel = menu.querySelector('.tech-translate-multilingual');
    multilingualLabel.style.display = 'flex';
    multilingualLabel.style.alignItems = 'center';
    multilingualLabel.style.gap = '6px';
    multilingualLabel.style.fontSize = '12px';
    multilingualLabel.style.marginBottom = '8px';
    multilingualLabel.style.cursor = 'pointer';
    multilingualLabel.style.color = '#B1B3BC';

    const multilingualCheck = menu.querySelector('.tech-multilingual-check');
    multilingualCheck.style.width = '14px';
    multilingualCheck.style.height = '14px';
    multilingualCheck.style.margin = '0';
    multilingualCheck.style.cursor = 'pointer';
    multilingualCheck.style.accentColor = '#02c7b5';

    translationLanguages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        select.appendChild(option);
    });

    const translateButton = menu.querySelector('.tech-translate-submit');
    translateButton.style.width = '100%';
    translateButton.style.padding = '7px';
    translateButton.style.border = 'none';
    translateButton.style.borderRadius = '5px';
    translateButton.style.cursor = 'pointer';
    translateButton.style.background = '#02c7b5';
    translateButton.style.color = '#000';
    translateButton.style.fontSize = '13px';

    const status = menu.querySelector('.tech-translate-status');
    status.style.fontSize = '11px';
    status.style.marginTop = '7px';
    status.style.color = '#6B707F';

    document.body.appendChild(menu);

    const rect = button.getBoundingClientRect();
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;
    let left = rect.right - menuW;
    let top = rect.bottom + 8;

    if (left < 10) left = 10;
    if (left + menuW > window.innerWidth - 10) left = window.innerWidth - menuW - 10;
    if (top + menuH > window.innerHeight - 10) top = rect.top - menuH - 8;
    if (top < 10) top = 10;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    translateButton.addEventListener('click', async () => {
        const targetLanguage = select.value;
        if (!targetLanguage) {
            status.textContent = 'Please select a language.';
            return;
        }

        const editor = findEditorNear(button);
        if (!editor) {
            status.textContent = 'Odoo message box not found.';
            return;
        }

        const originalText = getEditorText(editor).trim();
        if (!originalText) {
            status.textContent = 'Please enter a message first.';
            return;
        }

        translateButton.disabled = true;
        status.textContent = 'Rewriting & translating...';

        try {
            const { groqApiKey } = await chrome.storage.local.get(['groqApiKey']);
            if (!groqApiKey) {
                throw new Error('Groq API key is not set. Save it in the extension popup first.');
            }

            const multilingual = multilingualCheck.checked;
            const { rewritten, translated } = await rewriteAndTranslate(originalText, targetLanguage, groqApiKey);

            if (!translated || !translated.trim()) {
                throw new Error('Translation returned empty text.');
            }

            let output;
            if (multilingual) {
                output = `${translated}\n\n--------------Translated from English -------------------------\n\n${rewritten}`;
            } else {
                output = translated;
            }

            replaceComposerText(editor, output);
            status.textContent = 'Done.';
            setTimeout(() => { menu.remove(); }, 400);
        } catch (error) {
            console.warn('Translation error:', error);
            status.textContent = error.message || 'Translation failed.';
            translateButton.disabled = false;
        }
    });

    setTimeout(() => {
        document.addEventListener('click', function outsideClick(event) {
            if (!menu.contains(event.target) && event.target !== button) {
                menu.remove();
                document.removeEventListener('click', outsideClick);
            }
        });
    }, 0);
}


async function rewriteAndTranslate(text, targetLanguageCode, apiKey) {
    const language = translationLanguages.find(l => l.code === targetLanguageCode);
    const languageName = language ? language.name : targetLanguageCode;

    const prompt = `You are a professional support message editor and translator.

Step 1 - Rewrite: Improve the following message for clarity, grammar, and professionalism. Keep the meaning intact and keep any placeholders unchanged. Do not add or remove significant content.

Step 2 - Translate: Translate the rewritten message into ${languageName}. Keep placeholders unchanged in the translation.

Original message:
"""
${text}
"""

Respond with valid JSON only, no markdown, in this exact format:
{"rewritten": "Rewritten version in the original language", "translated": "Translated version"}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1024,
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
            throw new Error('Invalid Groq API key. Please update it in the extension popup.');
        }
        throw new Error(`Groq API error: ${errorData.error?.message || response.status}`);
    }

    const result = await response.json();
    let content = result.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error('No response from Groq API');
    }

    content = content.trim();
    if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    }

    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        const match = content.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Failed to parse translation response.');
        data = JSON.parse(match[0]);
    }

    if (!data.rewritten || !data.translated) {
        throw new Error('Incomplete translation response.');
    }

    return { rewritten: data.rewritten.trim(), translated: data.translated.trim() };
}

function isMarkdownCapableEditor(editor) {
    if (!editor) return false;
    return !!(
        editor.closest('.modal') ||
        editor.closest('.wysiwyg-local-overlay') ||
        editor.closest('.wysiwyg') ||
        editor.closest('.note-editor')
    );
}

function markdownToPlainText(md) {
    if (!md) return md;
    const SEP = '--------------Translated from English -------------------------';
    return md.split(SEP).map((part) => {
        let text = part;
        text = text.replace(/```[\s\S]*?```/g, (block) =>
            block.replace(/```[^\n]*\n?/g, '').replace(/```$/g, '')
        );
        text = text.replace(/`([^`\n]+)`/g, '$1');
        text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
        text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
        text = text.replace(/(\*\*\*|___)(.*?)\1/g, '$2');
        text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
        text = text.replace(/(\*|_)(.*?)\1/g, '$2');
        text = text.replace(/^#{1,6}\s+/gm, '');
        text = text.replace(/^\s*>\s?/gm, '');
        text = text.replace(/^\s*[-*+]\s+/gm, '');
        text = text.replace(/^\s*\d+\.\s+/gm, '');
        text = text.replace(/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/gm, '');
        return text;
    }).join(SEP);
}

function replaceComposerText(editor, text) {
    if (!isMarkdownCapableEditor(editor)) {
        text = markdownToPlainText(text);
    }

    editor.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    document.execCommand('insertText', false, text);

    editor.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: text
    }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
    editor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
}

const translateObserver = new MutationObserver(() => {
    addTranslateButton();
    addAIRewriteButton();
    addModalFooterButtons();
});

if (document.body) {
    translateObserver.observe(document.body, { childList: true, subtree: true });
}

initializeTranslateButton();


function getTicketContext() {
    return new Promise((resolve, reject) => {
        try {
            let subject = '';
            const subjectSelectors = [
                '.o_form_view .o_form_label',
                '.o-mail-Chatter .o_form_label',
                '.o-mail-Thread .o_form_label'
            ];

            for (const selector of subjectSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    subject = element.textContent.trim();
                    break;
                }
            }

            const messages = [];
            const messageElements = document.querySelectorAll('.o-mail-Message');

            messageElements.forEach(messageElement => {
                const authorElement = messageElement.querySelector('.o-mail-Message-author');
                const bodyElement = messageElement.querySelector('.o-mail-Message-body');
                const dateElement = messageElement.querySelector('.o-mail-Message-date');

                const author = authorElement ? authorElement.textContent.trim() : 'Unknown';
                const body = bodyElement ? bodyElement.textContent.trim() : '';
                const date = dateElement ? dateElement.textContent.trim() : '';

                if (body) {
                    messages.push({ author, body, date });
                }
            });

            resolve({ subject, messages });
        } catch (error) {
            reject(error);
        }
    });
}


async function rewriteWithGroq(text, apiKey) {
    if (!apiKey) {
        throw new Error('Groq API key is required');
    }

    const prompt = `Rewrite the following text to improve clarity, grammar, and professionalism while keeping the meaning intact. Make minimal changes - only fix obvious errors and improve flow. Do not add or remove significant content:

${text}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1024,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error: ${errorData.error?.message || response.status}`);
    }

    const result = await response.json();
    const rewrittenText = result.choices?.[0]?.message?.content;

    if (!rewrittenText) {
        throw new Error('No rewritten text returned from Groq API');
    }

    return rewrittenText.trim();
}

function saveGroqAPIKey(apiKey) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ groqApiKey: apiKey }, () => {
            resolve();
        });
    });
}

async function performAIRewriteSilent(button, apiKey) {
    const editor = findEditorNear(button);
    if (!editor) return;

    const originalText = getEditorText(editor).trim();
    if (!originalText) return;

    try {
        await saveGroqAPIKey(apiKey);
        const rewrittenText = await rewriteWithGroq(originalText, apiKey);
        replaceComposerText(editor, rewrittenText);
    } catch (error) {
        console.warn('AI rewrite error:', error);
    }
}

function addAIRewriteButton() {
    const quickActions = document.querySelector('.o-mail-Composer-quickActions');
    if (!quickActions) return;

    const actionList = quickActions.querySelector('.o-mail-ActionList');
    if (!actionList) return;

    if (actionList.querySelector('.tech-support-ai-btn')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tech-support-ai-btn o-mail-ActionList-button btn btn-group-item position-relative o-inline btn-secondary d-flex align-items-center border-0 rounded-circle';
    button.setAttribute('aria-label', 'AI Rewrite Message');
    button.setAttribute('title', 'AI Rewrite Message');
    button.innerHTML = `<i class="fa fa-magic fa-fw"></i>`;
    button.style.width = '32px';
    button.style.height = '32px';
    button.style.marginLeft = '3px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let apiKey = null;
        try {
            const result = await chrome.storage.local.get(['groqApiKey']);
            apiKey = result.groqApiKey;
        } catch (error) {
            console.warn('Failed to get API key from storage:', error);
        }

        if (apiKey && typeof apiKey === 'string' && apiKey.trim() !== '') {
            try {
                await performAIRewriteSilent(button, apiKey.trim());
            } catch (error) {
                console.warn('AI rewrite error:', error);
            }
        }
    });

    actionList.appendChild(button);
}

function createFooterButton(className, icon, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className + ' btn btn-light d-flex align-items-center justify-content-center';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.innerHTML = `<i class="fa ${icon} fa-fw"></i>`;
    btn.style.cursor = 'pointer';
    return btn;
}

function matchFooterButtonSize(btn, footer) {
    const s = footer.querySelector('button:not([class*="tech-support"])');
    if (s) {
        btn.style.height = s.offsetHeight + 'px';
        btn.style.padding = getComputedStyle(s).padding;
    }
}

function hasWysiwygEditor(root) {
    if (!root) return false;
    return !!root.querySelector('.wysiwyg, .note-editor, [contenteditable="true"], .o-mail-Composer-input');
}

function addModalFooterButtons() {
    const footers = document.querySelectorAll(
        '.modal-footer.d-empty-none, .wysiwyg-local-overlay .modal-footer'
    );

    footers.forEach((footer) => {
        const modalRoot = footer.closest('.modal') || footer.closest('.wysiwyg-local-overlay');
        if (!hasWysiwygEditor(modalRoot)) {
            return;
        }

        if (!footer.querySelector('.tech-support-translate-btn')) {
            const translateBtn = createFooterButton(
                'tech-support-translate-btn',
                'fa-language',
                'Translate Message'
            );
            translateBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                openTranslateMenu(translateBtn);
            });
            footer.appendChild(translateBtn);
            matchFooterButtonSize(translateBtn, footer);
        }

        if (!footer.querySelector('.tech-support-ai-btn')) {
            const aiBtn = createFooterButton(
                'tech-support-ai-btn',
                'fa-magic',
                'Rewrite'
            );
            aiBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                let apiKey = null;
                try {
                    const result = await chrome.storage.local.get(['groqApiKey']);
                    apiKey = result.groqApiKey;
                } catch (error) {
                    console.warn('Failed to get API key from storage:', error);
                }

                if (apiKey && typeof apiKey === 'string' && apiKey.trim() !== '') {
                    try {
                        await performAIRewriteSilent(aiBtn, apiKey.trim());
                    } catch (error) {
                        console.warn('AI rewrite error:', error);
                    }
                }
            });
            footer.appendChild(aiBtn);
            matchFooterButtonSize(aiBtn, footer);
        }
    });
}

// Initialize both buttons
function initializeTranslateButton() {
    addTranslateButton();
    addAIRewriteButton();
    addModalFooterButtons();
}