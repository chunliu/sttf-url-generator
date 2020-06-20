"use strict";
// Create the message box element
const template = document.createElement("template");
template.innerHTML = '<div class="sttf-url-msg-box"> \
        <span class="helper"></span> \
        <div> \
            <p>The STTF link has been copied!</p> \
        </div> \
    </div>';

const msgbox = template.content.firstChild;
document.body.append(msgbox);

// Use fade in/out to display the message box
function fadeOut(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

function fadeIn(element) {
    var op = 0.1;
    element.style.display = "block";
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

// Listen to the message from background
chrome.runtime.onMessage.addListener(
    function(request){
        if (request.sttfmsg === "copied") {
            fadeIn(msgbox);
            setTimeout(fadeOut, 1000, msgbox);
        }
});