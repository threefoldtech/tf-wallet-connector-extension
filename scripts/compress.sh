#!/bin/bash

name="tf-wallet-connector-extension-v$VERSION.zip";

# Assume this file is run from root directory

cd ./extension
zip -r $name ./*