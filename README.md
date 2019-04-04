# TshirtShop

TshirtShop

## Installation

```sh
git clone https://github.com/wassim-dev/tshirtshop.git
cd tshirtshop
npm run install-dependencies
```

## Start backend server

```sh
npm run backend-server
```

## Start frontend server

```sh
npm run frontend-server
```

## Configuration

Backend Configuration in file backend/config.js

```js
{
    PORT: 80,
    API_BASE_PATH: "/api",
    BUILD_DIR: path.join(__dirname, '../frontend/build'),
    IMAGES_DIR: "/product-images/",
    MYSQL: {
        connectionLimit: 30,
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "root",
        database: ""
    },
    FIREBASE: {
        databaseURL : "",
        type : "",
        project_id : "",
        private_key_id : "",
        private_key : "",
        client_email : "",
        client_id : "",
        auth_uri : "",
        token_uri : "",
        auth_provider_x509_cert_url : "",
        client_x509_cert_url : ""
    }
}
```

Frontend Configuration in file frontend/src/config.js

```js
{
    API_ENDPOINT:  "/api",
    FIREBASE: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
    }
}
```
