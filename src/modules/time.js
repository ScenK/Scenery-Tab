class Time {
  getCurrentTime() {
    return new Date().toLocaleTimeString(chrome.i18n.getUILanguage(), { hour12: false, hour: "numeric", minute: "numeric"});
  }
}
