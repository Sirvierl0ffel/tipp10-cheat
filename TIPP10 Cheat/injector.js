(function () {
  // Chrome
  if (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) {
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('tipp10cheat.js');
    (document.head || document.documentElement).appendChild(script);
    return;
  }

  // Firefox
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('tipp10cheat.js');
  document.documentElement.appendChild(script);
})();
