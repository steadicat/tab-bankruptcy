document.getElementById("copy-tab").addEventListener("click", (e) => {
  flashAndClosePopup(e.currentTarget);
  chrome.tabs.query({ active: true }, function (tabs) {
    copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
  });
});
document.getElementById("copy-all-tabs").addEventListener("click", (e) => {
  flashAndClosePopup(e.currentTarget);
  chrome.tabs.query({}, function (tabs) {
    tabs = filterTabs(tabs);
    copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
  });
});
document.getElementById("copy-and-close-tab").addEventListener("click", (e) => {
  flashAndClosePopup(e.currentTarget);
  chrome.tabs.query({ active: true }, function (tabs) {
    copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
    closeTabs(tabs);
  });
});
document
  .getElementById("copy-and-close-all-tabs")
  .addEventListener("click", (e) => {
    flashAndClosePopup(e.currentTarget);
    chrome.tabs.query({}, function (tabs) {
      tabs = filterTabs(tabs);
      copy(getWindowsPlainText(tabs), getWindowsRichText(tabs));
      closeTabs(tabs);
    });
  });

const isMac = /(Mac_PowerPC)|(Macintosh)/;

Array.from(document.querySelectorAll(".shortcut")).map((el) => {
  if (!isMac.test(navigator.userAgent)) return;
  el.innerText = el.innerText
    .replace(/Shift/gu, "\u21e7")
    .replace(/Alt/gu, "\u2325")
    .replace(/\+/g, "")
    // Shift goes first
    .replace(/(.+)\u21e7/gu, "\u21e7$1");
});
