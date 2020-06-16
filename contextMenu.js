'use strict';

function quoteOnClick(info, tab) {
    var prefix = "#:~:text=";
    var fragmentLink = info.pageUrl + prefix + encodeURIComponent(info.selectionText);
    console.log(fragmentLink);

    // Create a hidden input
    var el = document.createElement('textarea');
    el.value = fragmentLink;
    document.body.append(el);

    // Copy the text to the clipboard
    el.select();
    var success = document.execCommand('copy');
    el.remove();

    if (success) {
        console.log("copy successfully.");
    } else {
        console.log("copy failed.");
    }

    chrome.tabs.create({"url": fragmentLink, "active": true});
}

var id = chrome.contextMenus.create({
    "title": "Get Fragment Link", 
    "id": "quote_doc",
    "contexts": ["selection"],
    "onclick": quoteOnClick
});