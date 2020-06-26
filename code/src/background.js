'use strict';

function getFragment (fragStr) {
  const str = fragStr.trim();

  if (str.length < 300) {
    // Use exact matching
    return encodeURIComponent(str);
  } else {
    // Use range-based matching
    const start = str.match(/^(\S+\s+){5}/);
    const end = str.match(/(\s+\S+){5}$/);
    return encodeURIComponent(start[0]) + ',' + encodeURIComponent(end[0]);
  }
}

function copyToClipboard (content) {
  // Create a hidden input
  const ta = document.createElement('textarea');
  ta.value = content;
  document.body.append(ta);

  // Copy the text to the clipboard
  ta.select();
  const success = document.execCommand('copy');
  ta.remove();

  return success;
}

function quoteOnClick (info) {
  // Create the fragment link.
  let directive = '#:~:text=';
  // Support multiple text fragments.
  const regex = RegExp(directive, 'g');
  if (regex.test(info.pageUrl)) {
    directive = '&text=';
  }

  const fragmentLink = info.pageUrl + directive + getFragment(info.selectionText);

  switch (info.menuItemId) {
    case 'sttf_open': {
      // Copy the link and open it in a new tab.
      copyToClipboard(fragmentLink);
      chrome.tabs.create({ url: fragmentLink, active: true });
      break;
    }
    case 'sttf_copy': {
      // Copy the link.
      copyToClipboard(fragmentLink);
      chrome.tabs.insertCSS({ file: './msgbox/msgbox.css' }, function () {
        chrome.tabs.executeScript({ file: './msgbox/msgbox.js' });
      });
      break;
    }
    case 'sttf_copy_md': {
      // Copy the selected text and the link as markdown.
      const md = '[' + info.selectionText.trim() + '](' + fragmentLink + ')';
      copyToClipboard(md);
      chrome.tabs.insertCSS({ file: './msgbox/msgbox.css' }, function () {
        chrome.tabs.executeScript({ file: './msgbox/msgbox.js' });
      });
      break;
    }
  }
}

/* global chrome */
chrome.contextMenus.onClicked.addListener(quoteOnClick);

chrome.runtime.onInstalled.addListener(function () {
  // Initialize
  chrome.contextMenus.create({
    title: 'STTF Link',
    id: 'sttf_parent',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'Copy',
    id: 'sttf_copy',
    parentId: 'sttf_parent',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'Open',
    id: 'sttf_open',
    parentId: 'sttf_parent',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'Copy as MD',
    id: 'sttf_copy_md',
    parentId: 'sttf_parent',
    contexts: ['selection']
  });

  chrome.storage.local.clear(function () {
    chrome.storage.local.set({
      showOpen: true,
      showCopy: true,
      showCopyMd: false
    });
  });
});

chrome.storage.onChanged.addListener(function (changes) {
  for (const key in changes) {
    const storageChange = changes[key];

    switch (key) {
      case 'showCopy': {
        chrome.contextMenus.update('sttf_copy', { visible: storageChange.newValue });
        break;
      }
      case 'showOpen': {
        chrome.contextMenus.update('sttf_open', { visible: storageChange.newValue });
        break;
      }
      case 'showCopyMd': {
        chrome.contextMenus.update('sttf_copy_md', { visible: storageChange.newValue });
        break;
      }
    }
  }
  // Disable the parent menu if all children are disabled.
  chrome.storage.local.get(['showOpen', 'showCopy', 'showCopyMd'], function (result) {
    const disableParent = result.showOpen || result.showCopy || result.showCopyMd;
    chrome.contextMenus.update('sttf_parent', { enabled: disableParent });
  });
});
