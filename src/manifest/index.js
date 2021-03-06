const pkg = require('../../package.json');

const manifestInput = {
    manifest_version: 2,
    name: 'Reader Lens',
    version: pkg.version,
    web_accessible_resources: [
        "/fonts/*", '/assets/*'
    ],
    icons: {
        '16': 'assets/icons/icon-16.png',
        '32': 'assets/icons/icon-32.png',
        '48': 'assets/icons/icon-48.png',
        '128': 'assets/icons/icon-128.png',
    },

    description: 'Reader Lens is an attempt to help people read better. It separates phrases of text into its own window.',
    homepage_url: 'https://github.com/Riverface/The-Extension-for-Kids-who-Can-t-Read-Good',
    short_name: 'Reader Lens',

    permissions: ['activeTab', 'storage', "fontSettings", 'http://*/*', 'https://*/*'],
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

    '__chrome|firefox__author': 'riverface',
    __opera__developer: {
        name: 'riverface',
    },

    __firefox__applications: {
        gecko: { id: '{754FB1AD-CC3B-4856-B6A0-7786F8CA9D17}' },
    },
    __chrome__minimum_chrome_version: '49',
    __opera__minimum_opera_version: '36',

    browser_action: {
        default_popup: 'popup.html',
        default_icon: {
            '16': 'assets/icons/icon-16.png',
            '32': 'assets/icons/icon-32.png',
            '48': 'assets/icons/icon-48.png',
            '128': 'assets/icons/icon-128.png',
        },
        default_title: 'tiny title',
        '__chrome|opera__chrome_style': true,
        __firefox__browser_style: true,
    },

    '__chrome|opera__options_page': 'options.html',

    options_ui: {
        page: 'options.html',
        open_in_tab: true,
        __chrome__chrome_style: true,
    },

    background: {
        page: "background.html",
        '__chrome|opera__persistent': true,
    },

    content_scripts: [{
        matches: ['http://*/*', 'https://*/*'],
        js: ['js/contentScript.bundle.js']
    },],
};

module.exports = manifestInput;