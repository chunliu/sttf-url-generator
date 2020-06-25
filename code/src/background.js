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
  // Create fragment link
  const directive = '#:~:text=';
  // If the page url has a fragment already, remove it first.
  const regex = RegExp(directive, 'g');
  let pageUrl = info.pageUrl;
  if (regex.test(info.pageUrl)) {
    pageUrl = info.pageUrl.split(directive)[0];
  }

  const fragmentLink = pageUrl + directive + getFragment(info.selectionText);

  switch (info.menuItemId) {
    case 'sttf_open': {
      copyToClipboard(fragmentLink);
      chrome.tabs.create({ url: fragmentLink, active: true });
      break;
    }
    case 'sttf_copy': {
      copyToClipboard(fragmentLink);
      chrome.tabs.insertCSS({ file: './msgbox/msgbox.css' }, function () {
        chrome.tabs.executeScript({ file: './msgbox/msgbox.js' });
      });
      break;
    }
    case 'sttf_copy_md': {
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

function showMenuItem (id, title, create) {
  if (create) {
    chrome.contextMenus.create({
      title: title,
      id: id,
      parentId: 'sttf_parent',
      contexts: ['selection']
    });
  } else {
    chrome.contextMenus.remove(id);
  }
}

chrome.runtime.onInstalled.addListener(function () {
  // Initialize
  chrome.contextMenus.create({
    title: 'STTF Link',
    id: 'sttf_parent',
    contexts: ['selection']
  });
  showMenuItem('sttf_copy', 'Copy', true);
  showMenuItem('sttf_open', 'Open', true);

  chrome.storage.local.set({
    showOpen: true,
    showCopy: true,
    showCopyMd: false
  });

  // chrome.storage.local.get(['showOpen', 'showCopy', 'showCopyMd'], function (result) {
  //   console.log(JSON.stringify(result));
  //   console.log(result.showOpen);
  // });
});

chrome.storage.onChanged.addListener(function (changes) {
  for (const key in changes) {
    const storageChange = changes[key];
    // If it is triggered by onInstall, do nothing.
    if (storageChange.oldValue === undefined) {
      continue;
    }

    let id = '';
    let title = '';
    switch (key) {
      case 'showCopy': {
        id = 'sttf_copy';
        title = 'Copy';
        break;
      }
      case 'showOpen': {
        id = 'sttf_open';
        title = 'Open';
        break;
      }
      case 'showCopyMd': {
        id = 'sttf_copy_md';
        title = 'Copy as MD';
        break;
      }
    }
    showMenuItem(id, title, storageChange.newValue);
  }
});
