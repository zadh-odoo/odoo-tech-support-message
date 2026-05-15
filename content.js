// Content script that runs on Odoo pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insertMessage') {
    insertMessageIntoComposer(request.message);
    sendResponse({ success: true });
  }
  return true;
});

function insertMessageIntoComposer(message) {
  // Convert escaped newlines into actual newlines
  message = message
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');

  const sendButton = document.querySelector(
    '.o-mail-Chatter-sendMessage.btn'
  );
  const iseditor = document.querySelector(
      '.o-mail-Composer-input.o-mail-Composer-bg'
  );  

  if (sendButton && !iseditor) {
    sendButton.click();
  }

  setTimeout(() => {
    const editor = document.querySelector(
      '.o-mail-Composer-input.o-mail-Composer-bg'
    );  

    if (!editor) {
      console.log('Odoo Tech Support: Composer not found');
      return;
    }

    // Focus editor
    editor.focus();

    // Clear existing content
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);

    // Insert formatted text
    document.execCommand('insertText', false, message);

    // Trigger Odoo update
    editor.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: message
    }));

  }, 300);
}