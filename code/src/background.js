(async (browser) => {
  const getFragment = (fragStr) => {
    const str = fragStr.trim();
    if (str.length < 300) {
      // Use exact matching
      return encodeURIComponent(str);
    }
    // Use range-based matching
    const start = str.match(/^(\S+\s+){5}/);
    const end = str.match(/(\s+\S+){5}$/);
    return encodeURIComponent(start[0]) + ',' + encodeURIComponent(end[0]);
  };

  const copyToClipboard = (content) => {
    // Create a hidden input
    const ta = document.createElement('textarea');
    ta.value = content;
    document.body.append(ta);

    // Copy the text to the clipboard
    ta.select();
    const success = document.execCommand('copy');
    ta.remove();

    return success;
  };

  const sendMessageToCurrentTab = (message, data = null) => {
    return new Promise((resolve, reject) => {
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { message, data }, (response) => {
          if (!response && browser.runtime.lastError) {
            return reject(
              new Error('Failed to connect to the specified tab.')
            );
          }
          return resolve(response);
        });
      });
    });
  };

  const injectScript = async () => {
    try {
      // If no error, the script has been injected.
      await sendMessageToCurrentTab('is_ready');
    } catch (err) {
      await new Promise((resolve) => {
        browser.tabs.insertCSS({ file: './content/msgbox.css' }, () => {
          browser.tabs.executeScript({ file: './content/content.js' }, () => {
            return resolve();
          });
        });
      });
    }
  };

  const getSelectedText = async () => {
    await injectScript();
    const response = await sendMessageToCurrentTab('get_selection');
    return response.selection;
  };

  const quoteOnClick = async (info) => {
    // Create the fragment link.
    let directive = '#:~:text=';
    // Support multiple text fragments.
    const regex = RegExp(directive, 'g');
    if (regex.test(info.pageUrl)) {
      directive = '&text=';
    }

    const selectedText = await getSelectedText();
    const fragmentLink = info.pageUrl + directive + getFragment(selectedText);

    switch (info.menuItemId) {
      case 'sttf_open': {
        // Copy the link and open it in a new tab.
        copyToClipboard(fragmentLink);
        browser.tabs.create({ url: fragmentLink, active: true });
        break;
      }
      case 'sttf_copy': {
        // Copy the link.
        copyToClipboard(fragmentLink);
        await sendMessageToCurrentTab('show_message', '🎉 The text fragment link has been copied.');
        break;
      }
      case 'sttf_copy_md': {
        // Copy the selected text and the link as markdown.
        const md = '[' + selectedText + '](' + fragmentLink + ')';
        copyToClipboard(md);
        await sendMessageToCurrentTab('show_message', '🎉 The text fragment link has been copied as Markdown.');
        break;
      }
    }
  };

  browser.contextMenus.onClicked.addListener(quoteOnClick);

  browser.runtime.onInstalled.addListener(() => {
    // Initialize
    browser.contextMenus.create({
      title: 'STTF Link',
      id: 'sttf_parent',
      contexts: ['selection']
    });
    browser.contextMenus.create({
      title: 'Copy',
      id: 'sttf_copy',
      parentId: 'sttf_parent',
      contexts: ['selection']
    });
    browser.contextMenus.create({
      title: 'Open',
      id: 'sttf_open',
      parentId: 'sttf_parent',
      contexts: ['selection']
    });
    browser.contextMenus.create({
      title: 'Copy as MD',
      id: 'sttf_copy_md',
      parentId: 'sttf_parent',
      contexts: ['selection']
    });

    browser.storage.local.clear(() => {
      browser.storage.local.set({
        showOpen: true,
        showCopy: true,
        showCopyMd: false
      });
    });
  });

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      const storageChange = changes[key];

      switch (key) {
        case 'showCopy': {
          browser.contextMenus.update('sttf_copy', { visible: storageChange.newValue });
          break;
        }
        case 'showOpen': {
          browser.contextMenus.update('sttf_open', { visible: storageChange.newValue });
          break;
        }
        case 'showCopyMd': {
          browser.contextMenus.update('sttf_copy_md', { visible: storageChange.newValue });
          break;
        }
      }
    }
    // Disable the parent menu if all children are disabled.
    browser.storage.local.get(['showOpen', 'showCopy', 'showCopyMd'], (result) => {
      const disableParent = result.showOpen || result.showCopy || result.showCopyMd;
      browser.contextMenus.update('sttf_parent', { enabled: disableParent });
    });
  });
  // eslint-disable-next-line no-undef
})(chrome || browser);
