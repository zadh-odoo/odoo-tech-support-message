// ============================================================
// Odoo Tech Support - Content Script
// ============================================================

// ============================================================
// 1. MESSAGE LISTENER
// ============================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Insert message into Odoo composer
    if (request.action === 'insertMessage') {
        insertMessageIntoComposer(request.message);
        sendResponse({ success: true });
        return true;
    }

    // Get ticket context for AI
    if (request.action === 'getTicketContext') {
        getTicketContext()
            .then((context) => {
                sendResponse({
                    success: true,
                    context: context
                });
            })
            .catch((error) => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });

        return true;
    }

    return true;
});


// ============================================================
// 2. INSERT MESSAGE INTO ODOO COMPOSER
// ============================================================

function insertMessageIntoComposer(message) {

    // Convert escaped newlines into actual newlines
    message = message
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');

    const sendButton = document.querySelector(
        '.o-mail-Chatter-sendMessage.btn'
    );

    const isEditor = document.querySelector(
        '.o-mail-Composer-input.o-mail-Composer-bg'
    );

    // Open composer if it is closed
    if (sendButton && !isEditor) {
        sendButton.click();
    }

    setTimeout(() => {

        const editor = document.querySelector(
            '.o-mail-Composer-input.o-mail-Composer-bg'
        );

        if (!editor) {
            console.log(
                'Odoo Tech Support: Composer not found'
            );
            return;
        }

        // Focus editor
        editor.focus();

        // Clear existing content
        document.execCommand(
            'selectAll',
            false,
            null
        );

        document.execCommand(
            'delete',
            false,
            null
        );

        // Insert message
        document.execCommand(
            'insertText',
            false,
            message
        );

        // Trigger Odoo update
        editor.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                inputType: 'insertText',
                data: message
            })
        );

    }, 300);
}


// ============================================================
// 3. TRANSLATE BUTTON
// ============================================================

function addTranslateButton() {

    const quickActions = document.querySelector(
        '.o-mail-Composer-quickActions'
    );

    if (!quickActions) {
        return;
    }

    const actionList = quickActions.querySelector(
        '.o-mail-ActionList'
    );

    if (!actionList) {
        return;
    }

    // Don't add the button twice
    if (
        actionList.querySelector(
            '.tech-support-translate-btn'
        )
    ) {
        return;
    }

    // --------------------------------------------------------
    // Create Translate button
    // --------------------------------------------------------

    const button = document.createElement('button');

    button.type = 'button';

    button.className =
        'tech-support-translate-btn ' +
        'o-mail-ActionList-button ' +
        'btn btn-group-item position-relative ' +
        'o-inline btn-secondary d-flex ' +
        'align-items-center border-0 rounded-circle';

    button.setAttribute(
        'aria-label',
        'Translate Message'
    );

    button.setAttribute(
        'title',
        'Translate Message'
    );

    button.innerHTML = `
        <i class="fa fa-language fa-fw"></i>
    `;

    // --------------------------------------------------------
    // Button styling
    // --------------------------------------------------------

    button.style.width = '32px';
    button.style.height = '32px';
    button.style.marginLeft = '3px';
    button.style.cursor = 'pointer';

    // --------------------------------------------------------
    // Click
    // --------------------------------------------------------

    button.addEventListener('click', (event) => {

        event.preventDefault();
        event.stopPropagation();

        openTranslateMenu(button);
    });

    // Add beside emoji button
    actionList.appendChild(button);
}


// ============================================================
// 4. LANGUAGE LIST
// ============================================================

const translationLanguages = [

    {
        code: 'es',
        name: 'Spanish'
    },

    {
        code: 'fr',
        name: 'French'
    },

    {
        code: 'de',
        name: 'German'
    },

    {
        code: 'it',
        name: 'Italian'
    },

    {
        code: 'pt',
        name: 'Portuguese'
    },

    {
        code: 'hi',
        name: 'Hindi'
    },

    {
        code: 'ar',
        name: 'Arabic'
    },

    {
        code: 'ja',
        name: 'Japanese'
    },

    {
        code: 'ko',
        name: 'Korean'
    },

    {
        code: 'zh',
        name: 'Chinese'
    },

    {
        code: 'nl',
        name: 'Dutch'
    },

    {
        code: 'ru',
        name: 'Russian'
    },

    {
        code: 'tr',
        name: 'Turkish'
    },

    {
        code: 'pl',
        name: 'Polish'
    },

    {
        code: 'uk',
        name: 'Ukrainian'
    },

    {
        code: 'vi',
        name: 'Vietnamese'
    }
];


// ============================================================
// 5. OPEN TRANSLATION MENU
// ============================================================

function openTranslateMenu(button) {

    // Remove old menu
    const oldMenu = document.querySelector(
        '.tech-support-translate-menu'
    );

    if (oldMenu) {
        oldMenu.remove();
    }

    // --------------------------------------------------------
    // Create menu
    // --------------------------------------------------------

    const menu = document.createElement('div');

    menu.className =
        'tech-support-translate-menu';

    menu.innerHTML = `
        <div class="tech-translate-title">
            Translate message
        </div>

        <select class="tech-translate-language">
            <option value="">
                Select language
            </option>
        </select>

        <button
            type="button"
            class="tech-translate-submit"
        >
            Translate
        </button>

        <div class="tech-translate-status"></div>
    `;

    // --------------------------------------------------------
    // Menu CSS
    // --------------------------------------------------------

    menu.style.position = 'fixed';
    menu.style.zIndex = '999999';
    menu.style.background = '#ffffff';
    menu.style.border = '1px solid #d0d0d0';
    menu.style.borderRadius = '8px';
    menu.style.padding = '12px';
    menu.style.width = '220px';
    menu.style.boxShadow =
        '0 4px 20px rgba(0, 0, 0, 0.25)';

    // --------------------------------------------------------
    // Title
    // --------------------------------------------------------

    const title = menu.querySelector(
        '.tech-translate-title'
    );

    title.style.fontSize = '13px';
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';
    title.style.color = '#333';


    // --------------------------------------------------------
    // Select
    // --------------------------------------------------------

    const select = menu.querySelector(
        '.tech-translate-language'
    );

    select.style.width = '100%';
    select.style.padding = '7px';
    select.style.border =
        '1px solid #ccc';
    select.style.borderRadius = '5px';
    select.style.marginBottom = '8px';
    select.style.fontSize = '13px';

    // Add languages
    translationLanguages.forEach(language => {

        const option =
            document.createElement('option');

        option.value = language.code;
        option.textContent = language.name;

        select.appendChild(option);
    });


    // --------------------------------------------------------
    // Translate button
    // --------------------------------------------------------

    const translateButton =
        menu.querySelector(
            '.tech-translate-submit'
        );

    translateButton.style.width = '100%';
    translateButton.style.padding = '7px';
    translateButton.style.border = 'none';
    translateButton.style.borderRadius = '5px';
    translateButton.style.cursor = 'pointer';
    translateButton.style.background =
        '#714B67';
    translateButton.style.color =
        '#ffffff';
    translateButton.style.fontSize =
        '13px';


    // --------------------------------------------------------
    // Status
    // --------------------------------------------------------

    const status =
        menu.querySelector(
            '.tech-translate-status'
        );

    status.style.fontSize = '11px';
    status.style.marginTop = '7px';
    status.style.color = '#666';


    // --------------------------------------------------------
    // Add menu to page
    // --------------------------------------------------------

    document.body.appendChild(menu);


    // --------------------------------------------------------
    // Position menu
    // --------------------------------------------------------

    const rect =
        button.getBoundingClientRect();

    let left =
        rect.left - 185;

    let top =
        rect.bottom + 8;

    // Keep inside screen
    if (left < 10) {
        left = 10;
    }

    if (
        left + 220 >
        window.innerWidth - 10
    ) {
        left =
            window.innerWidth - 230;
    }

    if (
        top + 160 >
        window.innerHeight
    ) {
        top =
            rect.top - 170;
    }

    menu.style.left =
        `${left}px`;

    menu.style.top =
        `${top}px`;


    // --------------------------------------------------------
    // Translate click
    // --------------------------------------------------------

    translateButton.addEventListener(
        'click',
        async () => {

            const targetLanguage =
                select.value;

            if (!targetLanguage) {

                status.textContent =
                    'Please select a language.';

                return;
            }

            const editor =
                document.querySelector(
                    '.o-mail-Composer-input.o-mail-Composer-bg'
                );

            if (!editor) {

                status.textContent =
                    'Odoo message box not found.';

                return;
            }

            const originalText =
                editor.value.trim();

            if (!originalText) {

                status.textContent =
                    'Please enter a message first.';

                return;
            }

            // Don't translate if already empty
            translateButton.disabled = true;

            status.textContent =
                'Translating...';

            try {

                const translatedText =
                    await translateText(
                        originalText,
                        targetLanguage
                    );

                if (
                    !translatedText ||
                    !translatedText.trim()
                ) {

                    throw new Error(
                        'Translation returned empty text.'
                    );
                }

                // Replace Odoo composer
                replaceComposerText(
                    editor,
                    translatedText
                );

                status.textContent =
                    'Translation completed.';

                // Close after short delay
                setTimeout(() => {
                    menu.remove();
                }, 400);

            } catch (error) {

                console.error(
                    'Translation error:',
                    error
                );

                status.textContent =
                    error.message ||
                    'Translation failed.';

                translateButton.disabled =
                    false;
            }
        }
    );


    // --------------------------------------------------------
    // Close menu when clicking outside
    // --------------------------------------------------------

    setTimeout(() => {

        document.addEventListener(
            'click',
            function outsideClick(event) {

                if (
                    !menu.contains(event.target) &&
                    event.target !== button
                ) {

                    menu.remove();

                    document.removeEventListener(
                        'click',
                        outsideClick
                    );
                }
            }
        );

    }, 0);
}


// ============================================================
// 6. CHROME BUILT-IN TRANSLATOR API
// ============================================================

async function translateText(
    text,
    targetLanguage
) {

    // Check browser support
    if (!('Translator' in self)) {

        throw new Error(
            'Chrome Translator API is not available. ' +
            'Please use a Chrome version that supports ' +
            'the built-in Translator API.'
        );
    }

    // --------------------------------------------------------
    // Create translator
    // --------------------------------------------------------

    const translator =
        await Translator.create({
            sourceLanguage: 'en',
            targetLanguage: targetLanguage
        });


    // --------------------------------------------------------
    // Translate paragraph by paragraph
    // --------------------------------------------------------
    // This preserves blank lines and formatting better.
    // --------------------------------------------------------

    const paragraphs =
        text.split(/\n\n+/);

    const translatedParagraphs = [];

    for (
        const paragraph
        of paragraphs
    ) {

        if (paragraph.trim()) {

            const translated =
                await translator.translate(
                    paragraph.trim()
                );

            translatedParagraphs.push(
                translated
            );

        } else {

            translatedParagraphs.push('');
        }
    }


    // --------------------------------------------------------
    // Combine
    // --------------------------------------------------------

    const translatedText =
        translatedParagraphs.join(
            '\n\n'
        );

    return translatedText;
}


// ============================================================
// 7. REPLACE TEXT IN ODOO COMPOSER
// ============================================================

function replaceComposerText(
    editor,
    text
) {

    // Focus
    editor.focus();

    // Select existing content
    document.execCommand(
        'selectAll',
        false,
        null
    );

    // Delete existing content
    document.execCommand(
        'delete',
        false,
        null
    );

    // Insert translated text
    document.execCommand(
        'insertText',
        false,
        text
    );

    // Trigger Odoo input event
    editor.dispatchEvent(
        new InputEvent('input', {
            bubbles: true,
            inputType: 'insertText',
            data: text
        })
    );

    // Trigger change event
    editor.dispatchEvent(
        new Event('change', {
            bubbles: true
        })
    );

    // Trigger keyup as additional Odoo compatibility
    editor.dispatchEvent(
        new KeyboardEvent('keyup', {
            bubbles: true
        })
    );
}


// ============================================================
// 8. ADD TRANSLATE BUTTON WHEN ODOO COMPOSER APPEARS
// ============================================================

function initializeTranslateButton() {

    addTranslateButton();
}


// Odoo is a dynamic application.
// The composer can be created after page load.

const translateObserver =
    new MutationObserver(() => {

        addTranslateButton();

    });


// Start observing page

if (document.body) {

    translateObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

}


// Try immediately

initializeTranslateButton();


// ============================================================
// 9. GET TICKET CONTEXT FOR AI
// ============================================================

function getTicketContext() {

    return new Promise(
        (resolve, reject) => {

            try {

                // ------------------------------------------------
                // Get subject
                // ------------------------------------------------

                let subject = '';

                const subjectSelectors = [
                    '.o_form_view .o_form_label',
                    '.o-mail-Chatter .o_form_label',
                    '.o-mail-Thread .o_form_label'
                ];

                for (
                    const selector
                    of subjectSelectors
                ) {

                    const element =
                        document.querySelector(
                            selector
                        );

                    if (
                        element &&
                        element.textContent.trim()
                    ) {

                        subject =
                            element.textContent.trim();

                        break;
                    }
                }


                // ------------------------------------------------
                // Get chatter messages
                // ------------------------------------------------

                const messages = [];

                const messageElements =
                    document.querySelectorAll(
                        '.o-mail-Message'
                    );

                messageElements.forEach(
                    messageElement => {

                        const authorElement =
                            messageElement.querySelector(
                                '.o-mail-Message-author'
                            );

                        const bodyElement =
                            messageElement.querySelector(
                                '.o-mail-Message-body'
                            );

                        const dateElement =
                            messageElement.querySelector(
                                '.o-mail-Message-date'
                            );

                        const author =
                            authorElement
                                ? authorElement.textContent.trim()
                                : 'Unknown';

                        const body =
                            bodyElement
                                ? bodyElement.textContent.trim()
                                : '';

                        const date =
                            dateElement
                                ? dateElement.textContent.trim()
                                : '';

                        if (body) {

                            messages.push({
                                author: author,
                                body: body,
                                date: date
                            });
                        }
                    }
                );


                // ------------------------------------------------
                // Return context
                // ------------------------------------------------

                resolve({
                    subject: subject,
                    messages: messages
                });

            } catch (error) {

                reject(error);
            }
        }
    );
}