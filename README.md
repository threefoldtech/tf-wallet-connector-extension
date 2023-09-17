# Threefold wallet connector extension (@threefold/extension)

**`tf wallet connector`** is an extension which allows users to store their accounts (aka. mnemonic) in an encrypted way, providing an interface for websites to interact with after getting access permission from the user himself.

### Install extension locally

> Note: Make sure to have node (>= v.18)

Then follow the steps:

```sh
# Install yarn
npm i -g yarn

# Clone extension repo
git clone https://github.com/threefoldtech/tf-wallet-connector-extension.git

# Go to extension directory
cd ./tf-wallet-connector-extension

# Install project dependencies
yarn

# Build extension
yarn build:extension

# Hit to your chrome and find `manage extension` then enable *developer mode* and *load unpack* which should be the build output `tf-wallet-connector-extension/extension`
```

Now whenever you refresh your browser `window.TF_WALLET_CONNECTOR_EXTENSION_HANDLER` should have an instance of extension handler and helper methods.

For better development experience consider check `extension_api` which is also located in the extension itself. [More Details](https://github.com/threefoldtech/tf-wallet-connector-extension/blob/development/api/public/README.md)
