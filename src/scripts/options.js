const options = {};

chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);
    optionsForm.debug.checked = Boolean(options.debug);;
});
optionsForm.debug.addEventListener('change', (event) => {
    options.debug = event.target.checked;
    chrome.storage.sync.set({ options });
});