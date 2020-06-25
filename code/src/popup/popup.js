'use strict';

/* global chrome */

chrome.storage.local.get(['showOpen'], function(result) {
    console.log('value currently is ' + result.key);
});