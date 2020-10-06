const titleRegex = /( - Google Docs$)|( - Google Sheets$)|( - Google Slides$)/;

/** @param {string} title */
function cleanUpTitle(title) {
  return title.replace(titleRegex, '');
}

/** @param {chrome.tabs.Tab} tab */
function getTabPlainText({ title, url }) {
  return `${cleanUpTitle(title ?? 'No title')}: ${url ?? '#'}`;
}

/**
 * @param {chrome.tabs.Tab} tab
 */
function getTabRichText({ title, url }) {
  return `<a href="${encodeURI(url ?? '#')}">${cleanUpTitle(
    title ?? 'No title'
  )}</a>`;
}

/**
 * @param {chrome.tabs.Tab[]} tabs
 * @param {string?} indent
 */
function getTabsPlainText(tabs, indent = '') {
  if (tabs.length === 0) return '';
  if (tabs.length === 1) return getTabPlainText(tabs[0]);
  return getTabsPlainTextAsList(tabs, indent);
}

/**
 * @param {chrome.tabs.Tab[]} tabs
 * @param {string?} indent
 */
function getTabsPlainTextAsList(tabs, indent = '') {
  if (tabs.length === 0) return '';
  return `${tabs
    .map((tab) => `${indent}- ${getTabPlainText(tab)}`)
    .join('\n')}`;
}

/**
 * @param {chrome.tabs.Tab[]} tabs
 */
function getTabsPlainTextWithoutDashes(tabs) {
  if (tabs.length === 0) return '';
  if (tabs.length === 1) return getTabPlainText(tabs[0]);
  return `${tabs.map((tab) => `${getTabPlainText(tab)}`).join('\n')}`;
}

/** @param {chrome.tabs.Tab[]} tabs */
function getTabsRichText(tabs) {
  if (tabs.length === 0) return '';
  if (tabs.length === 1) return getTabRichText(tabs[0]);
  return getTabsRichTextAsList(tabs);
}

/** @param {chrome.tabs.Tab[]} tabs */
function getTabsRichTextAsList(tabs) {
  if (tabs.length === 0) return '';
  return `<ul>${tabs
    .map((tab) => `<li><p>${getTabRichText(tab)}</p></li>`)
    .join('\n')}</ul>`;
}

/** @param {chrome.tabs.Tab[]} tabs */
function getWindowsPlainText(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsPlainText(tabs);
  return `${windows
    .map(
      (tabs, i) => `- Window ${i + 1}\n${getTabsPlainTextAsList(tabs, '  ')}`
    )
    .join('\n')}`;
}

/** @param {chrome.tabs.Tab[]} tabs */
function getWindowsMarkdown(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsPlainText(tabs);
  return `${windows
    .map((tabs, i) => `# Window ${i + 1}\n\n${getTabsPlainTextAsList(tabs)}`)
    .join('\n\n')}`;
}

/** @param {chrome.tabs.Tab[]} tabs */
function getWindowsPlainTextWithoutDashes(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsPlainTextWithoutDashes(tabs);
  return `${windows
    .map((tabs) => getTabsPlainTextWithoutDashes(tabs))
    .join('\n')}`;
}

/** @param {chrome.tabs.Tab[]} tabs */
function getWindowsRichText(tabs) {
  const windows = groupByWindow(tabs);
  if (windows.length < 2) return getTabsRichText(tabs);
  return `<ul>${windows
    .map(
      (tabs, i) => `<li>Window ${i + 1}\n${getTabsRichTextAsList(tabs)}</li>`
    )
    .join('\n')}</ul>`;
}

/**
 * @param {string} plainText
 * @param {string} richText
 */
function copy(plainText, richText) {
  /** @param {ClipboardEvent} e */
  function listener(e) {
    e.clipboardData?.setData('text/plain', plainText);
    e.clipboardData?.setData('text/html', richText);
    e.preventDefault();
  }
  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}

/**
 * @param {string} content
 * @param {'text/plain' | 'text/html'} format
 * @param {'txt' | 'md' | 'html'} extension
 */
function download(content, format, extension) {
  const el = document.createElement('a');
  el.setAttribute(
    'href',
    `data:${format};charset=utf-8,${encodeURIComponent(content)}`
  );
  el.setAttribute('download', `openTabs-${Date.now()}.${extension}`);
  el.click();
}

/** @param {chrome.tabs.Tab[]} tabs */
function closeTabs(tabs) {
  for (const { id } of tabs) {
    if (!id) continue;
    chrome.tabs.remove(id);
  }
}

/** @param {chrome.tabs.Tab[]} tabs */
function groupByWindow(tabs) {
  /** @type {Record<number, chrome.tabs.Tab[]>} */
  const windows = {};
  for (const tab of tabs) {
    windows[tab.windowId] || (windows[tab.windowId] = []);
    windows[tab.windowId].push(tab);
  }
  return Object.values(windows);
}

/** @param {chrome.tabs.Tab[]} tabs */
function filterTabs(tabs) {
  return tabs.filter(({ pinned }) => !pinned);
}

/** @param {EventTarget | null} el */
function flashAndClosePopup(el) {
  if (!(el instanceof HTMLElement)) return;
  el.style.background = 'transparent';
  setTimeout(() => {
    el.style.background = '';
    window.close();
  }, 100);
}
