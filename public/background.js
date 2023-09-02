/** @type { declare } */

console.log('background')
console.log(chrome.runtime.getURL('index.html'))

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.windows.create({
//     url: chrome.runtime.getURL('index.html'),
//     type: 'popup' //No Address bar
//     //In here you can also add constrain for the window
//     //This is for manifest v3
//   })
//   //   console.log({ chrome, tabs })
//   // window.chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
// })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
  if (message === 'RequestAccess') {
    console.log('request access')
  }
  //   if (message.data === 'init') {
  //     return sendResponse({
  //       requestAccess: () => {
  //         chrome.windows.create({
  //           url: chrome.runtime.getURL('index.html'),
  //           type: 'popup'
  //         })
  //       }
  //     })
  //   }

  sendResponse('Thanks')
})
