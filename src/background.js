const config = {
    blacklist: new Set(),
    isCreateMenu: true,
};
let isInit = true;
const filter = { properties: ['status'] };

const addToBlacklist = (url) => {
    const { hostname } = new URL(url);
    if (hostname) {
        config.blacklist.add(hostname);
        saveConfig();
        browser.runtime.sendMessage({
            operation: 'refreshBlacklist',
        });
    }
};

const removeFromBlacklist = (hostname) => {
    config.blacklist.delete(hostname);
    saveConfig();
};

const createMenu = () => {
    browser.menus.create({
        id: 'blacklist-add',
        title: 'Add to auto mute blacklist',
        contexts: ['tab'],
    });
    browser.menus.onClicked.addListener(handleMenuOnClick);
    config.isCreateMenu = true;
    saveConfig();
};

const removeMenu = () => {
    browser.menus.remove('blacklist-add');
    config.isCreateMenu = false;
    saveConfig();
};

const saveConfig = () => {
    if (!isInit) {
        browser.storage.local.set(config);
    }
};

const restoreConfig = () => {
    browser.storage.local.get().then((conf) => {
        if (Object.entries(conf).length === 0 && conf.constructor === Object) {
            createMenu();
            return;
        }

        config.isCreateMenu = conf.isCreateMenu;
        config.blacklist = conf.blacklist;

        if (config.isCreateMenu) {
            createMenu();
        }
    });
};

const handleTabUpdated = (tabId, changeInfo, tabInfo) => {
    if (changeInfo.status === 'complete' && config.blacklist.has((new URL(tabInfo.url)).hostname)) {
        browser.tabs.update(tabId, { muted: true });
    }
};

const handleOnMessage = (request, _sender, sendResponse) => {
    switch (request.operation) {
        case 'getConfig':
            sendResponse(config);
            break;
        case 'addToBlacklist':
            addToBlacklist(request.url);
            break;
        case 'removeFromBlacklist':
            removeFromBlacklist(request.hostname);
            break;
        case 'disableMenu':
            removeMenu();
            break;
        case 'enableMenu':
            createMenu();
            break;
        default:
            break;
    }

};

const handleMenuOnClick = (info, tab) => {
    switch (info.menuItemId) {
        case 'blacklist-add':
            addToBlacklist(tab.url);
            break;
        default:
            break;
    }
};

const init = () => {
    restoreConfig();
    browser.runtime.onMessage.addListener(handleOnMessage);
    browser.tabs.onUpdated.addListener(handleTabUpdated, filter);
    isInit = false;
};

init();