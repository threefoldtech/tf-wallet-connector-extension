# Threefold wallet connector API

`tf-wallet-connector-api` is a npm package which allows to easily interact with **`tf-wallet-connector-extension`** by exposing an interface which will be clarified below.

## Install

Exactly like any regular npm package you can go ahead and install it with _yarn_ or _npm_ as follow

```bash
# Using yarn
yarn add @threefold/extension_api

# Using npm
npm install @threefold/extension_api
```

## Usage

Api package doesn't require any special configuration or api key just import it and go.

```ts
import { ThreefoldWalletConnectorApi } from '@threefold/extension_api'
import type {
  KeypairType,
  NetworkOptions,
  PublicAccount,
  SignReturn,
  Unsubscribe
} from '@threefold/extension_api'

// Go ahead and use it (note: check blow for api details)
console.log('API', ThreefoldWalletConnectorApi)
```

### API Details

> Note: All methods in api are static you don't need to initialize an instance from api constructor.

Here is a list of the available api methods:

| Method                                                                                             | Description                                                                                                                                               |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isInstalledSync(): boolean`                                                                       | Checks whether the extension is installed or no. if not installed and the document.readyState !== `complete` will log a warn and returns false.           |
| `isInstalled(): Promise<boolean>`                                                                  | Same as `isInstalledSync` but awaits `window.onload`. **(Recommended)**                                                                                   |
| `hasAccess(): Promise<boolean>`                                                                    | Checks whether this website granted access permission from the extension or no.                                                                           |
| `requestAccess(): Promise<boolean>`                                                                | Same as `hasAccess` but if the user doesn't have access it will show a popup requesting the user to allow that specific website to get access permission. |
| `selectAccount(network?: string \| string[]): Promise<PublicAccount \| null>`                      | Select a decrypted account from the user accounts list.                                                                                                   |
| `getPublicAccounts(network?: string \| string[]): Promise<Account[]>`                              | Fetch all `visible (aka. public)` accounts from the extension. (note: seed is encrypted)                                                                  |
| `listenToPublicAccounts(listener: (accounts: Account[], error?: string) => void): Unsubscribe`     | Same as `getPublicAccounts` but continually listen to public accountss changes.                                                                           |
| `listenToAuthList(listener: (list: AuthList) => void): Unsubscribe`                                | Allows to listen to changed applied to auth list.                                                                                                         |
| `requestDecryptedAccount(mnemonic: string, network?: string \| string[]): Promise<string \| null>` | Request a specific mnemonic to be decrypted. shows a popup for the user asking him to enter his account password in order to decrypt his account.         |
| `selectDecryptedAccount(): Promise<Account \| null>`                                               | Shows a popup with all the user accounts and asks him to pick an account and enter his password in order to decrypt it's seed and returns it back.        |
| `sign(content: string, mnemonic: string, keypairType: KeypairType): Promise<SignReturn \| null>`   | signs your content using your mnemonic.                                                                                                                   |
