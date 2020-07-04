((browser) => {
  const onCheckboxChanged = (event) => {
    switch (event.target.id) {
      case 'showOpen':
        browser.storage.local.set({ showOpen: event.target.checked });
        break;
      case 'showCopy':
        browser.storage.local.set({ showCopy: event.target.checked });
        break;
      case 'showCopyMd':
        browser.storage.local.set({ showCopyMd: event.target.checked });
        break;
    }
  };

  browser.storage.local.get(['showOpen', 'showCopy', 'showCopyMd'], (result) => {
    // console.log(JSON.stringify(result));
    document.getElementById('showOpen').checked = result.showOpen;
    document.getElementById('showCopy').checked = result.showCopy;
    document.getElementById('showCopyMd').checked = result.showCopyMd;
  });

  document.getElementById('showOpen').addEventListener('change', onCheckboxChanged);
  document.getElementById('showCopy').addEventListener('change', onCheckboxChanged);
  document.getElementById('showCopyMd').addEventListener('change', onCheckboxChanged);
  // eslint-disable-next-line no-undef
})(chrome || browser);
