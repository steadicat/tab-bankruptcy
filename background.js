chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case "copy-tab":
      chrome.tabs.query({ active: true }, function (tabs) {
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      });
      break;
    case "copy-all-tabs":
      chrome.tabs.query({}, function (tabs) {
        tabs = filterTabs(tabs);
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      });
      break;
    case "copy-and-close-tab":
      chrome.tabs.query({ active: true }, function (tabs) {
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
        closeTabs(tabs);
      });
      break;
    case "copy-and-close-all-tabs":
      chrome.tabs.query({}, function (tabs) {
        tabs = filterTabs(tabs);
        copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
        closeTabs(tabs);
      });
      break;
  }
});
