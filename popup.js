const match = matchMedia('(prefers-color-scheme: dark)');
chrome.runtime.sendMessage({ scheme: match.matches ? 'dark' : 'light' });
match.addListener(({ matches }) => {
  chrome.runtime.sendMessage({ scheme: matches ? 'dark' : 'light' });
});

document.getElementById('copy-tab')?.addEventListener('click', (e) => {
  flashAndClosePopup(e.currentTarget);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
  });
});
document.getElementById('copy-all-tabs')?.addEventListener('click', (e) => {
  flashAndClosePopup(e.currentTarget);
  chrome.tabs.query({}, function (tabs) {
    tabs = filterTabs(tabs);
    copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
  });
});
document
  .getElementById('copy-and-close-tab')
  ?.addEventListener('click', (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      closeTabs(tabs);
    });
  });
document
  .getElementById('copy-and-close-all-tabs')
  ?.addEventListener('click', (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({}, function (tabs) {
      tabs = filterTabs(tabs);
      copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      closeTabs(tabs);
    });
  });

document
  .getElementById('download-tabs-as-txt')
  ?.addEventListener('click', (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({}, function (tabs) {
      tabs = filterTabs(tabs);
      download(getWindowsPlainTextWithoutDashes(tabs), 'text/plain', 'txt');
    });
  });
document
  .getElementById('download-tabs-as-md')
  ?.addEventListener('click', (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({}, function (tabs) {
      tabs = filterTabs(tabs);
      download(getWindowsMarkdown(tabs), 'text/plain', 'md');
    });
  });
document
  .getElementById('download-tabs-as-html')
  ?.addEventListener('click', (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({}, function (tabs) {
      tabs = filterTabs(tabs);
      download(getWindowsRichText(tabs), 'text/html', 'html');
    });
  });

const isMac = /(Mac_PowerPC)|(Macintosh)/;

Array.from(document.querySelectorAll('.shortcut')).map((el) => {
  if (!isMac.test(navigator.userAgent)) return;
  if (!(el instanceof HTMLElement)) return;
  el.innerText = el.innerText
    .replace(/Shift/gu, '\u21e7')
    .replace(/Alt/gu, '\u2325')
    .replace(/\+/g, '')
    // Shift goes first
    .replace(/(.+)\u21e7/gu, '\u21e7$1');
});
