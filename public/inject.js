function injectScript(name) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', window.chrome.runtime.getURL(`${name}.js`))
  document.body.appendChild(script)
}

console.log('inject.js')
injectScript('store')
