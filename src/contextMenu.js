'use strict';

function getFragment(fragStr) {
    
    const str = fragStr.trim();

    if(fragStr.length < 300) {
        // Use exact matching
        return encodeURIComponent(str);
    } else {
        // Use range-based matching
        const start = str.match(/^(\S+\s+){5}/);
        const end = str.match(/(\s+\S+){5}$/);
        return encodeURIComponent(start[0]) + "," + encodeURIComponent(end[0]);
    }
}

function copyToClipboard(content) {
    // Create a hidden input
    const ta = document.createElement('textarea');
    ta.value = content;
    document.body.append(ta);

    // Copy the text to the clipboard
    ta.select();
    const success = document.execCommand('copy');
    ta.remove();

    if (success) {
        console.log("copy successfully.");
    } else {
        console.log("copy failed.");
    }
}

function quoteOnClick(info) {
    const directive = "#:~:text=";
    const fragmentLink = info.pageUrl + directive + getFragment(info.selectionText);
    console.log(fragmentLink);

    copyToClipboard(fragmentLink);

    chrome.tabs.create({"url": fragmentLink, "active": true});
}

chrome.contextMenus.onClicked.addListener(quoteOnClick);

chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({
        "title": "Open STTF Url", 
        "id": "quote_doc",
        "contexts": ["selection"]
    });
});