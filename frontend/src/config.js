let hostname = window && window.location && window.location.host;
if (hostname === "localhost:3000") {
    hostname = "http://localhost:80";
} else {
    hostname = "";
}

module.exports = {
    API_ENDPOINT: hostname + "/api",
    STRIPE_PK: "pk_test_B3nXtz6vFDH6PistYqaILGmC",
    FIREBASE: {
        apiKey: "AIzaSyAt0Wr7WMkpZ5Eolpdw0O4YE3QlDp8Zkzk",
        authDomain: "turing-tshirtshop.firebaseapp.com",
        databaseURL: "https://turing-tshirtshop.firebaseio.com",
        projectId: "turing-tshirtshop",
        storageBucket: "turing-tshirtshop.appspot.com",
        messagingSenderId: "578679204678"
    }
}