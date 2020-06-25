'use strict';

function onCheckboxChanged (event) {
  switch (event.target.id) {
    case 'showOpen':
      chrome.storage.local.set({ showOpen: event.target.checked });
      break;
    case 'showCopy':
      chrome.storage.local.set({ showCopy: event.target.checked });
      break;
    case 'showCopyMd':
      chrome.storage.local.set({ showCopyMd: event.target.checked });
      break;
  }
}

(function () {
  /* global chrome */
  chrome.storage.local.get(['showOpen', 'showCopy', 'showCopyMd'], function (result) {
    // console.log(JSON.stringify(result));
    document.getElementById('showOpen').checked = result.showOpen;
    document.getElementById('showCopy').checked = result.showCopy;
    document.getElementById('showCopyMd').checked = result.showCopyMd;
  });

  document.getElementById('showOpen').addEventListener('change', onCheckboxChanged);
  document.getElementById('showCopy').addEventListener('change', onCheckboxChanged);
  document.getElementById('showCopyMd').addEventListener('change', onCheckboxChanged);
})();
