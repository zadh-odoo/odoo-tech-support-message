document.addEventListener('DOMContentLoaded', () => {
  const nameSection = document.getElementById('nameSection');
  const welcomeSection = document.getElementById('welcomeSection');
  const messageList = document.getElementById('messageList');
  const emptyState = document.getElementById('emptyState');
  const userNameInput = document.getElementById('userName');
  const saveNameBtn = document.getElementById('saveNameBtn');
  const savedNameSpan = document.getElementById('savedName');
  const editNameLink = document.getElementById('editName');

  // Modal elements
  const messageModal = document.getElementById('messageModal');
  const modalTitle = document.getElementById('modalTitle');
  const messageTitleInput = document.getElementById('messageTitle');
  const messageContentInput = document.getElementById('messageContent');
  const cancelMessageBtn = document.getElementById('cancelMessageBtn');
  const saveMessageBtn = document.getElementById('saveMessageBtn');
  const addMessageBtn = document.getElementById('addMessageBtn');
  const resetMessagesBtn = document.getElementById('resetMessagesBtn');

  let editingMessageId = null;
  let editingMessageIsDefault = false;
  let nextCustomId = 11;

  // Default messages
  const defaultMessages = [
    {
      id: 1,
      title: 'Investigating',
      content: "Hello,\n\nI am {name} from Tech Support, and I will be assisting you with this issue.\n\nI am currently investigating the issue and analyzing the root cause. I will get back to you with an update and the appropriate solution as soon as possible.\n\nThank you for your patience.\n\nRegards,\n{name}",
      desc: 'Issue under investigation'
    },
    {
      id: 2,
      title: 'Standard Bug Confirmed',
      content: "Hello,\n\nI am {name} from Tech Support, and I will be assisting you with this issue.\n\nUpon investigation, I confirmed that this is a standard bug in the system.\n\nThank you for bringing this issue to our attention. We have forwarded it to our bugfix team for a fix.\n\nOnce the issue is resolved, we will notify you immediately.\n\nWe apologize for the inconvenience and appreciate your patience.\n\nThank you.\n\nRegards,\n{name}\nTech Support",
      desc: 'Standard bug confirmed'
    },
    {
      id: 3,
      title: 'Schedule Call',
      content: "Hello,\n\nLet's connect at [Time here].\n\nGoogle Meet:\n[link here]\n\nRegards,\n{name}",
      desc: 'Schedule a call'
    },
    {
      id: 4,
      title: 'Fix Deployed',
      content: "Hello,\n\n\nThank you for your patience.\n\nThe fix for the issue has now been successfully deployed to your database.\n\nCould you please verify on your end and confirm that everything is working as expected?\n\nPlease feel free to reach out if you have any questions or if you notice anything unusual.\n\nRegards,\n{name}\nTech Support",
      desc: 'Fix deployed to database'
    },
    {
      id: 5,
      title: 'Fix in Pipeline',
      content: "Hello,\n\nThank you for your patience.\n\nI have created a fix for the issue you are facing. The fix is currently in the deployment pipeline, and I will notify you once it has been deployed to your database.\n\nPlease feel free to reach out if you have any questions in the meantime.\n\nRegards,\n{name}\nTech Support",
      desc: 'Fix in deployment pipeline'
    },
    {
      id: 6,
      title: 'Known Bug',
      content: "Hello,\n\n\nThank you for your patience.\n\nThis issue is a known bug in Odoo. We have forwarded it to the relevant bug-fix team for further investigation and resolution.\n\nWe appreciate you bringing this matter to our attention. Rest assured, we will notify you as soon as the issue is resolved.\n\nIf you have any additional questions in the meantime, please feel free to reach out.\n\nRegards,\n{name}\nTech Support",
      desc: 'Known bug reported'
    },
    {
      id: 7,
      title: 'View Fix Applied',
      content: "Hello,\n\nI am {name} from Tech Support, and I will be assisting you with this issue.\n\nUpon investigation, I found that the issue [Explain an issue here] was caused by [Explain cause here].\n\nTo fix this issue:\n\n[Step 1 here]\n\n[Step 2 here]\n\n[Step 3 here]\n\nAfter performing these steps, the issue will be resolved.\n\nI have already applied this fix on your duplicate database for verification purposes:\n\n[link here]\n\nPlease check and confirm that everything is working as expected.\n\n\nPlease let me know if you need any further assistance.\n\nThank you.\n\nRegards,\n{name}\nTech Support",
      desc: 'View/inactive fix applied'
    },
    {
      id: 8,
      title: 'Dummy DB Verification',
      content: "Hello,\n\nI am {name} from Tech Support. I will be assisting you with this issue.\n\nI have applied the fix in a temporary (dummy) database for verification purposes:\n[link here]\n\nPlease check that everything is working as expected in this database.\n\nNote: This environment is temporary and created only for verification. It will be deleted automatically after some time, and any changes made here will not affect your production database.\n\nOnce you confirm, I will proceed with applying the same fix to your production database.\n\nThank you.\n\nRegards,\n{name}\nTech Support",
      desc: 'Dummy DB for verification'
    },
    {
      id: 9,
      title: 'Production Deployed',
      content: "Hello,\n\nThe fix has been successfully implemented in the production database.\n\nPlease review and let me know if everything is working as expected.\n\nRegards,\n{name}",
      desc: 'Fix deployed to production'
    },
    {
      id: 10,
      title: 'Staging Verification',
      content: "Hello,\n\n\nI am {name} from Tech Support. I will be assisting you with this issue.\n\nI have identified the issue and applied the appropriate fix on the staging environment for verification purposes:\n\n[link here]\n\nPlease check and confirm that everything works as expected in this database.\n\n\nOnce you confirm, I will apply the same fix on the production environment as well.\n\n\nThank you.\n\nRegards,\n{name}",
      desc: 'Staging environment fix'
    }
  ];

  // Load saved name and messages on startup
  chrome.storage.local.get(['techSupportName', 'customMessages', 'editedMessages', 'messagesVersion'], (result) => {
    const currentVersion = 2; // Increment when updating default messages
    const storedVersion = result.messagesVersion || 1;

    // Clear edited messages if version changed (new defaults)
    let editedMessages = result.editedMessages || {};
    if (storedVersion < currentVersion) {
      editedMessages = {};
      chrome.storage.local.set({ messagesVersion: currentVersion });
    }

    if (result.techSupportName) {
      showWelcomeSection(result.techSupportName);
      const customMessages = result.customMessages || [];
      renderMessages(editedMessages, customMessages);
    } else {
      nameSection.style.display = 'block';
      messageList.classList.remove('active');
      emptyState.style.display = 'none';
      renderMessages({}, []);
    }
  });

  // Save name button click
  saveNameBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name) {
      chrome.storage.local.set({ techSupportName: name }, () => {
        showWelcomeSection(name);
        renderMessages({}, []);
      });
    }
  });

  // Edit name link click
  editNameLink.addEventListener('click', () => {
    chrome.storage.local.get(['techSupportName'], (result) => {
      userNameInput.value = result.techSupportName || '';
      nameSection.style.display = 'block';
      welcomeSection.style.display = 'none';
      messageList.classList.remove('active');
      emptyState.style.display = 'none';
    });
  });

  function showWelcomeSection(name) {
    savedNameSpan.textContent = name;
    nameSection.style.display = 'none';
    welcomeSection.style.display = 'block';
    messageList.classList.add('active');
    emptyState.style.display = 'none';
  }

  function getMessageContent(msg, editedMessages, customMessages) {
    // Check if it's a custom message
    const customMsg = customMessages.find(m => m.id === msg.id);
    if (customMsg) {
      return customMsg.content;
    }
    // Check if it's been edited
    if (editedMessages[msg.id]) {
      return editedMessages[msg.id].content;
    }
    // Return default
    return msg.content;
  }

  function getMessageTitle(msg, editedMessages, customMessages) {
    const customMsg = customMessages.find(m => m.id === msg.id);
    if (customMsg) {
      return customMsg.title;
    }
    if (editedMessages[msg.id]) {
      return editedMessages[msg.id].title;
    }
    return msg.title;
  }

  function getMessageDesc(msg, editedMessages, customMessages) {
    const customMsg = customMessages.find(m => m.id === msg.id);
    if (customMsg) {
      return customMsg.desc;
    }
    if (editedMessages[msg.id]) {
      return editedMessages[msg.id].desc;
    }
    return msg.desc;
  }

  function renderMessages(editedMessages = {}, customMessages = []) {
    // Clear existing message items
    const existingItems = messageList.querySelectorAll('.message-item');
    existingItems.forEach(item => item.remove());
    const existingStdTitle = messageList.querySelector('.section-title-standard');
    const existingYourTitle = messageList.querySelector('.section-title-custom');
    const existingDivider = messageList.querySelector('.divider');
    const existingResetBtn = document.getElementById('resetMessagesBtn');

    if (existingStdTitle) existingStdTitle.remove();
    if (existingYourTitle) existingYourTitle.remove();
    if (existingDivider) existingDivider.remove();
    if (existingResetBtn) existingResetBtn.remove();

    // Add section titles
    const standardTitle = document.createElement('div');
    standardTitle.className = 'section-title section-title-standard';
    standardTitle.textContent = 'Standard Messages';
    messageList.insertBefore(standardTitle, addMessageBtn.nextSibling);

    // Render standard messages
    defaultMessages.forEach(msg => {
      const content = getMessageContent(msg, editedMessages, customMessages);
      const title = getMessageTitle(msg, editedMessages, customMessages);
      const desc = getMessageDesc(msg, editedMessages, customMessages);
      const isEdited = editedMessages[msg.id] !== undefined;

      const item = document.createElement('div');
      item.className = 'message-item';
      item.dataset.id = msg.id;
      item.dataset.isDefault = 'true';
      item.dataset.message = content;
      item.innerHTML = `
        <div class="title">${title}${isEdited ? ' <span class="edited-badge">(edited)</span>' : ''}</div>
        <small>${desc}</small>
        <div class="message-item-actions">
          <button class="message-action-btn btn-edit">Edit</button>
          <button class="message-action-btn btn-delete">Reset</button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('message-action-btn')) {
          return;
        }
        sendMessage(item.dataset.message);
      });

      const editBtn = item.querySelector('.btn-edit');
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(msg.id, title, content, true);
      });

      const deleteBtn = item.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetMessage(msg.id, editedMessages);
      });

      messageList.insertBefore(item, standardTitle.nextSibling);
    });

    // Add divider
    const divider = document.createElement('div');
    divider.className = 'divider';
    messageList.insertBefore(divider, addMessageBtn);

    // Add "Your Messages" title if there are custom messages
    if (customMessages.length > 0) {
      const yourTitle = document.createElement('div');
      yourTitle.className = 'section-title section-title-custom';
      yourTitle.textContent = 'Your Messages';
      messageList.insertBefore(yourTitle, addMessageBtn);

      customMessages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'message-item';
        item.dataset.id = msg.id;
        item.dataset.isDefault = 'false';
        item.dataset.message = msg.content;
        item.innerHTML = `
          <div class="title">${msg.title}</div>
          <small>${msg.desc || 'Custom message'}</small>
          <div class="message-item-actions">
            <button class="message-action-btn btn-edit">Edit</button>
            <button class="message-action-btn btn-delete">Delete</button>
          </div>
        `;

        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('message-action-btn')) {
            return;
          }
          sendMessage(item.dataset.message);
        });

        const editBtn = item.querySelector('.btn-edit');
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditModal(msg.id, msg.title, msg.content, false);
        });

        const deleteBtn = item.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteMessage(msg.id);
        });

        messageList.insertBefore(item, addMessageBtn);
      });
    }

    // Add reset all button if there are edited messages
    const editedCount = Object.keys(editedMessages).length;
    if (editedCount > 0) {
      const resetBtn = document.createElement('button');
      resetBtn.id = 'resetMessagesBtn';
      resetBtn.className = 'add-message-btn';
      resetBtn.style.marginTop = '12px';
      resetBtn.style.background = 'var(--o-danger)';
      resetBtn.style.color = 'var(--o-white)';
      resetBtn.textContent = `Reset All to Defaults (${editedCount} edited)`;
      messageList.appendChild(resetBtn);

      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all standard messages to defaults? This cannot be undone.')) {
          chrome.storage.local.set({ editedMessages: {} }, () => {
            chrome.storage.local.get(['customMessages'], (result) => {
              renderMessages({}, result.customMessages || []);
            });
          });
        }
      });
    }
  }

  function sendMessage(messageTemplate) {
    chrome.storage.local.get(['techSupportName'], (result) => {
      const name = result.techSupportName || 'Support';
      let formattedMessage = messageTemplate.replace(/{name}/g, name);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
          showError('No active tab found. Please make sure you are on a page and try again.');
          return;
        }

        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          action: 'insertMessage',
          message: formattedMessage
        }, (response) => {
          if (chrome.runtime.lastError) {
            injectContentScript(activeTab.id, formattedMessage);
          } else if (response && response.success) {
            window.close();
          } else {
            showError('Failed to insert message. Please try again.');
          }
        });
      });
    });
  }

  function injectContentScript(tabId, message) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        showError('Could not load the extension on this page. Please refresh the page and try again.');
        return;
      }
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {
          action: 'insertMessage',
          message: message
        }, (response) => {
          if (chrome.runtime.lastError) {
            showError('Could not insert message. Please make sure you are on an Odoo page.');
          } else {
            window.close();
          }
        });
      }, 500);
    });
  }

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'background: #fee; border: 1px solid #fcc; padding: 10px; margin: 10px; border-radius: 4px; color: #c00; font-size: 12px;';
    const messageList = document.getElementById('messageList');
    messageList.insertBefore(errorDiv, messageList.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  function openEditModal(id, title, content, isDefault) {
    editingMessageId = id;
    editingMessageIsDefault = isDefault;
    modalTitle.textContent = isDefault ? 'Edit Standard Message' : 'Edit Your Message';
    messageTitleInput.value = title;
    messageContentInput.value = content;
    messageModal.classList.add('active');
  }

  function openAddModal() {
    editingMessageId = null;
    editingMessageIsDefault = false;
    modalTitle.textContent = 'Add New Message';
    messageTitleInput.value = '';
    messageContentInput.value = '';
    messageModal.classList.add('active');
  }

  function closeModal() {
    messageModal.classList.remove('active');
    editingMessageId = null;
    editingMessageIsDefault = false;
  }

  function saveMessage() {
    const title = messageTitleInput.value.trim();
    const content = messageContentInput.value.trim();

    if (!title || !content) {
      alert('Please fill in both title and message content.');
      return;
    }

    if (editingMessageIsDefault) {
      // Edit a standard message
      chrome.storage.local.get(['editedMessages'], (result) => {
        const editedMessages = result.editedMessages || {};
        editedMessages[editingMessageId] = {
          title: title,
          content: content,
          desc: 'Customized message'
        };
        chrome.storage.local.set({ editedMessages: editedMessages }, () => {
          chrome.storage.local.get(['customMessages'], (res) => {
            renderMessages(editedMessages, res.customMessages || []);
            closeModal();
          });
        });
      });
    } else if (editingMessageId) {
      // Edit existing custom message
      chrome.storage.local.get(['customMessages'], (result) => {
        const customMessages = result.customMessages || [];
        const index = customMessages.findIndex(m => m.id === editingMessageId);
        if (index !== -1) {
          customMessages[index] = {
            ...customMessages[index],
            title: title,
            content: content
          };
          chrome.storage.local.set({ customMessages: customMessages }, () => {
            chrome.storage.local.get(['editedMessages'], (res) => {
              renderMessages(res.editedMessages || {}, customMessages);
              closeModal();
            });
          });
        }
      });
    } else {
      // Add new custom message
      chrome.storage.local.get(['customMessages'], (result) => {
        const customMessages = result.customMessages || [];
        const newId = nextCustomId++;
        customMessages.push({
          id: newId,
          title: title,
          content: content,
          desc: 'Custom message'
        });
        chrome.storage.local.set({ customMessages: customMessages }, () => {
          chrome.storage.local.get(['editedMessages'], (res) => {
            renderMessages(res.editedMessages || {}, customMessages);
            closeModal();
          });
        });
      });
    }
  }

  function resetMessage(id, editedMessages) {
    if (confirm('Reset this message to default?')) {
      const newEdited = { ...editedMessages };
      delete newEdited[id];
      chrome.storage.local.set({ editedMessages: newEdited }, () => {
        chrome.storage.local.get(['customMessages'], (result) => {
          renderMessages(newEdited, result.customMessages || []);
        });
      });
    }
  }

  function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
      chrome.storage.local.get(['customMessages'], (result) => {
        const customMessages = result.customMessages || [];
        const filtered = customMessages.filter(m => m.id !== id);
        chrome.storage.local.set({ customMessages: filtered }, () => {
          chrome.storage.local.get(['editedMessages'], (res) => {
            renderMessages(res.editedMessages || {}, filtered);
          });
        });
      });
    }
  }

  // Add message button
  addMessageBtn.addEventListener('click', openAddModal);

  // Modal buttons
  cancelMessageBtn.addEventListener('click', closeModal);

  saveMessageBtn.addEventListener('click', saveMessage);

  // Close modal on overlay click
  messageModal.addEventListener('click', (e) => {
    if (e.target === messageModal) {
      closeModal();
    }
  });
});