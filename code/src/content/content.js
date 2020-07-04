((browser) => {
  // Use fade in/out to display the message box
  const fadeOut = (element) => {
    var op = 1;
    var timer = setInterval(function () {
      if (op <= 0.1) {
        clearInterval(timer);
        element.style.display = 'none';
        element.remove();
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ')';
      op -= op * 0.1;
    }, 10);
  };

  const fadeIn = (element) => {
    var op = 0.1;
    element.style.display = 'block';
    var timer = setInterval(function () {
      if (op >= 1) {
        clearInterval(timer);
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ')';
      op += op * 0.1;
    }, 10);
  };

  const showMessageBox = () => {
    let msgbox = document.querySelector('sttf-url-msg-box');
    if (msgbox == null) {
      // Create the message box element
      const template = document.createElement('template');
      template.innerHTML = '<div class="sttf-url-msg-box"><span class="helper"></span><div><p>The STTF link has been copied!</p></div></div>';

      msgbox = template.content.firstChild;
      document.body.append(msgbox);
    }

    fadeIn(msgbox);
    setTimeout(fadeOut, 1000, msgbox);
  };

  // Based on: https://stackoverflow.com/a/7381574/6255000
  const snapSelectionToWord = (sel) => {
    if (!sel.isCollapsed) {
      // Detect if selection is backwards
      const range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);
      const direction = range.collapsed ? ['backward', 'forward'] : ['forward', 'backward'];
      range.detach();

      // modify() works on the focus of the selection
      const endNode = sel.focusNode;
      const endOffset = sel.focusOffset;
      sel.collapse(sel.anchorNode, sel.anchorOffset);
      sel.modify('move', direction[0], 'character');
      sel.modify('move', direction[1], 'word');
      sel.extend(endNode, endOffset);
      sel.modify('extend', direction[1], 'character');
      sel.modify('extend', direction[0], 'word');
    }
    return sel.toString().trim();
  };

  browser.runtime.onMessage.addListener((request, _, sendResponse) => {
    switch (request.message) {
      case 'is_ready':
        sendResponse('ready');
        break;
      case 'get_selection': {
        const selection = window.getSelection();
        const selectedText = snapSelectionToWord(selection);
        sendResponse({ selection: selectedText });
        break;
      }
      case 'show_message': {
        showMessageBox();
        sendResponse('shown');
        break;
      }
    }
  });
  // eslint-disable-next-line no-undef
})(chrome || browser);
