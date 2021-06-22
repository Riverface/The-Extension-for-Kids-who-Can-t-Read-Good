import browser from 'webextension-polyfill';

const FromBackground = new BroadcastChannel('toPopup');
document.addEventListener('DOMContentLoaded', async () => {
    const tabs = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    const url = tabs.length && tabs[0].url;
    const response = await browser.runtime.sendMessage({
        msg: 'hello',
        url,
    });
    console.log(response);
});

$(document).ready(function () {
    FromBackground.onmessage = function (event) {
        console.log(`message event received! '${event.data}'`);
    }
});