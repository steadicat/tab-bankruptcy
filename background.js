function getTabPlainText({ title, url }) {
  return `${title}: ${url}`;
}

function getTabRichText({ title, url }) {
  return `<a href="${encodeURI(url)}">${title}</a>`;
}

function getTabsPlainText(tabs, indent = "") {
  return `${tabs
    .map((tab) => `${indent}- ${getTabPlainText(tab, indent)}`)
    .join("\n")}`;
}
function getTabsRichText(tabs) {
  return `<ul>${tabs
    .map((tab) => `<li>${getTabRichText(tab)}</li>`)
    .join("\n")}</ul>`;
}

function getWindowsPlainText(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsPlainText(tabs);
  return `${windows
    .map((tabs, i) => `- Window ${i + 1}\n${getTabsPlainText(tabs, "  ")}`)
    .join("\n")}`;
}

function getWindowsRichText(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsRichText(tabs);
  return `<ul>${windows
    .map((tabs, i) => `<li>Window ${i + 1}\n${getTabsRichText(tabs)}</li>`)
    .join("\n")}</ul>`;
}

function copy(plainText, richText) {
  function listener(e) {
    e.clipboardData.setData("text/plain", plainText);
    e.clipboardData.setData("text/html", richText);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

function closeTabs(tabs) {
  for (const { id } of tabs) {
    chrome.tabs.remove(id);
  }
}

function groupByWindow(tabs) {
  const windows = {};
  for (const tab of tabs) {
    windows[tab.windowId] || (windows[tab.windowId] = []);
    windows[tab.windowId].push(tab);
  }
  return Object.values(windows);
}

function filterTabs(tabs) {
  return tabs.filter(({ pinned }) => !pinned);
}

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
