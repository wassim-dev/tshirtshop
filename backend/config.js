const path = require('path');

module.exports = {
    PORT: 80,
    API_BASE_PATH: "/api",
    BUILD_DIR: path.join(__dirname, '../frontend/build'),
    STRIPE_SK: "sk_test_vGNgMwO7Pnuh9UYERnd928Fi",
    IMAGES_DIR: "https://www.wassim.ovh/public/product-images/",
    MYSQL: {
        connectionLimit: 30,
        host: "bw13208-001.dbaas.ovh.net",
        port: 35178,
        user: "tshirtshop",
        password: "Azerty123",
        database: "tshirtshop"
    },
    FIREBASE: {
        "databaseURL": "https://turing-tshirtshop.firebaseio.com",
        "type": "service_account",
        "project_id": "turing-tshirtshop",
        "private_key_id": "49766168f7331b522e9156048f0493248e44d87f",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCrhmqzhtuyvVKu\nGuUS5wBQZqgQujOQcByjmJ3AERsx9BxKATsvFsN6qKIsYb2EuEdOSSTPpmu66Ie0\nhAu690Ev6tqqk+t/WCwdhfYka1aiZNdZ49hYaYikihQnDts/iOj35NcW6z3oMd6M\nBV/OqydG+SMOr6qC8Q68uoSJ6aWCg05GZtmn98EfCs34af2oqqgZyaVj9SuDxut7\nZV+X8qd42GlKHEXGDGL7/FLuP+JiR9O2o/3RLZ7aQj3LAaR82MkJ6HsQSjmZ1Pjf\nU6WW7ebb+pxGtoEP7T/anQIjIQ8rFUaMcnta+zk/rUmRKpHSiYT78PbozJZHjqgW\nrTcPqdYtAgMBAAECggEAA3O+HATf0RYcXuKtr5a0m+mlAkktFoAbI3PD4QS3HmdC\nVn712PnFT2erc+c3sD8hOEMimYdI7ccWTBzIO6gUSMmaQwqdF8AHi0SR8qOyZ6xN\n5UI/rW/aTy10QGD9KqcvwSV66rwrT8wJJZpKFle9f6EuAnKopOADIutCFaB9M0Y2\n0BniMsdrZnZiYpzKeWc9PgU0EMtuSqUxzb0ROhi0D3jFb2zc9QR8vfpVsmufMiQT\n6vKZHkxtWj+F/1rzKzj6yj3UX6+ml3dNAmF1O+oYQHf1yOO8DLo8WCGODXMFuv9c\nEm1QOI5SHY4Fi72ONh4UCOhumykTVejzwPKj6rJqYQKBgQDcNBvYlcbkOOLa0/Eb\nVFOAJ54pomdJ9tiJt2vsCOqvNyN9TTQXU/UdYcIwBqkFcCtg3qVsCNOedUYASs2k\nrfTJhz2Li4AXyUeiR54AnpGg2XdoYkHT0aAK7aEZRXZqC8hVmAj5TYJ2FYUx1SXh\nUWTPzYP6YIUPSfB/g4tbLXdaaQKBgQDHaIa5hMapruIbtQhMEaFdqFSc8fq/LrR0\n/jmzYaDhIFtFniKG+OUM1sRjlTwa58V8iwk7PXlRMowCt1V5d4XdHTv+K0+cEQJ5\nZVm444eFwUIidCxLVYlcD1tdUSIq2A2n01e4bBStc36ivxqhbd9jqvBIf80oFdKg\niiC4fpD9JQKBgQDT9UiUet8+kM80Sev8HXhelEP22X9Iv9WBAlBcm9yimZWMqAKr\nLcJz7MSJi++n72ehz841Jm3kSgf+ggJeMJ++WHJSXw4GV1WfjAY3nGqbBJienm20\noUPHISL/e1BXFU5ZrYV9yzD3zxEtfXj/4GQEblNKbxvFMqvPYeSC+Em5eQKBgQCH\n8nMnN6ZZOKleSmWFtt9UgtZsyWwxux28RTYBXaXY1b5kEBNqAXXm8uShH7UCgtDY\nv9FjWd3Dxbo+f87+KMZSoQOtnMmBlPci3D33FufmAIOeCaXJFl+3K6EWVaH9o55r\ntGIxkT3nor3LJo55T/bkdD2sr7Smh3o5iPIV1fPzIQKBgQDFoLc/5dlJ10ZVPneG\nhofr287DRfAM1G4rgNkXywjxTLgWCmD+46rYkfUtVo72qtNIwo/0IrGnobRYMbln\nQuCtVj6nCHuevmb5razMELBwaBJz6y9/HOCUpdNr/shsPralEUDBRX/FWxCyIY5u\nJvIl5X99ScPggsAPqMfuaFrGYw==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-q48y8@turing-tshirtshop.iam.gserviceaccount.com",
        "client_id": "107280861788170961431",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q48y8%40turing-tshirtshop.iam.gserviceaccount.com"
    }
}