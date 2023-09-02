/** @type { import("../src/global-components") } */

const btn = document.createElement('button')
btn.textContent = 'Request Access'
btn.onclick = () => {
  window.postMessage({
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event: 'RequestAccess',
    data: null
  })
}

document.body.prepend(btn)

// // @ts-check

// /** @type { import("../src/global-components") } */

// class WalletStore {
//   _account = null
//   _subscriptions = []

//   subscribe(subscription) {
//     this._subscriptions.push(subscription)
//     subscription(this._account)

//     return this.unsubscribe.bind(this, subscription)
//   }

//   unsubscribe(subscription) {
//     const index = this._subscriptions.indexOf(subscription)
//     if (index !== -1) {
//       this._subscriptions.splice(index, 1)
//     }
//   }

//   _update(account) {
//     if (this._account === account) {
//       return
//     }

//     if (this._account && account) {
//       /** @type { any } */
//       const _account = this._account
//       if (_account.mnemonic === account.mnemonic && _account.ssh === account.ssh) {
//         return
//       }
//     }

//     this._account = account
//     this._notify()
//   }

//   _notify() {
//     this._subscriptions.forEach((fn) => fn(this._account))
//   }
// }

// window[window.$TF_WALLET_CONNECTOR_EXTENSION] = new WalletStore()

// /* Listen to message from content.js */
// document.addEventListener(window.$TF_WALLET_CONNECTOR_EXTENSION, handleMessage)
// function handleMessage(/** @type { any}  */ e) {
//   const { detail: data } = e
//   window[window.$TF_WALLET_CONNECTOR_EXTENSION]._update(data)
// }
