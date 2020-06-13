chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'copy-tab':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      });
      break;
    case 'copy-all-tabs':
      chrome.tabs.query({}, (tabs) => {
        tabs = filterTabs(tabs);
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      });
      break;
    case 'copy-and-close-tab':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
        closeTabs(tabs);
      });
      break;
    case 'copy-and-close-all-tabs':
      chrome.tabs.query({}, (tabs) => {
        tabs = filterTabs(tabs);
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
        closeTabs(tabs);
      });
      break;
  }
});

chrome.runtime.onMessage.addListener((request) => {
  chrome.browserAction.setIcon({
    path:
      request.scheme === 'dark'
        ? {
            '16': 'icon-dark-16.png',
            '32': 'icon-dark-32.png',
            '256': 'icon-dark.png',
          }
        : {
            '16': 'icon-16.png',
            '32': 'icon-32.png',
            '256': 'icon.png',
          },
  });
});
