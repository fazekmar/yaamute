const init = () => {
    browser.runtime.sendMessage({
        operation: 'getConfig',
    }, setSettings);
    browser.runtime.onMessage.addListener(handleOnMessage);
};

const handleOnMessage = (request) => {
    switch (request.operation) {
        case 'refreshBlacklist':
            document.getElementById('blacklist').innerHTML = '';
            init();
            break;
        default:
            break;
    }
};

const setSettings = (config) => {
    initBlacklist([...config.blacklist]);
    initContextMenuCheckBox(config.isCreateMenu);
};

const initContextMenuCheckBox = (isEnabled) => {
    const checkBox = document.getElementById('toggleContextMenu');
    checkBox.onclick = () => setContextMenu();
    if (isEnabled) {
        checkBox.checked = true;
    } else {
        checkBox.checked = false;
    }
};

const setContextMenu = () => {
    browser.runtime.sendMessage({
        operation: document.getElementById('toggleContextMenu').checked ? 'enableMenu' : 'disableMenu',
    });
};

const initBlacklist = (blacklist) => {
    const pref = document.getElementById('blacklist');
    if (blacklist.length > 0) {
        blacklist.forEach((hostname) => pref.appendChild(createDiv(hostname)));
    } else {
        empyHostnameListMessage();
    }
};

const empyHostnameListMessage = () => {
    const p = document.createElement('p');
    p.innerHTML = 'Your blacklist is empty.</br>To add a site right-click in the tab and select "Add to auto mute blacklist"';
    document.getElementById('blacklist').appendChild(p);
};

const createDiv = (id) => {
    const div = document.createElement('div');
    div.className = 'hostnameList';
    div.id = id;
    div.appendChild(createRemoveButton(id));
    div.appendChild(document.createTextNode(id));
    return div;
};

const createRemoveButton = (id) => {
    const button = document.createElement('button');
    button.innerText = 'Remove';
    button.onclick = () => removeHostnameFromListAndSendMessage(id);
    return button;
};

const removeHostnameFromListAndSendMessage = (id) => {
    browser.runtime.sendMessage({
        operation: 'removeFromBlacklist',
        hostname: id,
    });
    document.getElementById(id).remove();

    const hostnameList = document.getElementsByClassName('hostnameList');
    if (hostnameList.length <= 0) {
        empyHostnameListMessage();
    }
};

init();