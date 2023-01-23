itaintprettybutittastesgood.com static site generator

# Requirements

Assuming Windows WSL 2 Ubuntu 22 env

Node 18+
```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs
```

Yarn
```sh
sudo corepack enable
sudo corepack prepare yarn@stable --activate
```

# Quick start

```sh
# initial setup
yarn install

# refresh token data (about once a month)
yarn token

# start server
yarn dev
```

# Troubleshooting Notes

Had to setup a new project to grant API access to google drive
https://console.cloud.google.com/home/dashboard?project=itaintprettybutittastesgood

Had an issue completing token generation (invalid redirect), see
https://github.com/cedricdelpoux/gatsby-source-google-docs/issues/180#issuecomment-1175154112

