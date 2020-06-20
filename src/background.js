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

    return success;
}

function tabUpdated(tabId, changeInfo) {
    console.log("tab update: " + tabId + ", status: " + changeInfo.status);
    if(changeInfo.status === "complete") {
        // Drop a message to the new tab when it is ready and remove the listener
        chrome.tabs.onUpdated.removeListener(tabUpdated);
        chrome.tabs.sendMessage(tabId, {sttfmsg: "copied"});
    }
}

function quoteOnClick(info) {
    // Create fragment link
    const directive = "#:~:text=";
    const fragmentLink = info.pageUrl + directive + getFragment(info.selectionText);
    // Copy it to clipboard
    copyToClipboard(fragmentLink);

    if(info.menuItemId == "sttf_open") {
        // Open a new tab if the user choose to
        chrome.tabs.onUpdated.addListener(tabUpdated);
        chrome.tabs.create({"url": fragmentLink, "active": true});
    } else {
        // Drop a message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {sttfmsg: "copied"});
        });
    }
}

chrome.contextMenus.onClicked.addListener(quoteOnClick);

chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({
        "title": "STTF Link", 
        "id": "sttf_parent",
        "contexts": ["selection"]
    });
    chrome.contextMenus.create({
        "title": "Open", 
        "id": "sttf_open",
        "parentId": "sttf_parent",
        "contexts": ["selection"]
    });
    chrome.contextMenus.create({
        "title": "Copy", 
        "id": "sttf_copy",
        "parentId": "sttf_parent",
        "contexts": ["selection"]
    });
});