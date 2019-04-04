import config from "../config";
export default class api {
  apiErrorHendler = null;
  request(method, path, data) {
    let fetchObj = {
      redirect: "follow",
      headers: {
        'Content-Type': 'application/json',
        'sessionid': localStorage.getItem("sessionid") || ""
      }
    };
    switch (method.toUpperCase()) {
      case "GET":
        path += this.serialize(data);
        break;
      case "POST":
        fetchObj.method = "POST";
        fetchObj.body = JSON.stringify(data);
        break;
      default:
        break;
    }
    return fetch(config.API_ENDPOINT + path, fetchObj).then(response =>
      response.json()
    ).then(data => {
      if (typeof data === "object") {
        if ('error' in data) {
          if (this.apiErrorHendler) this.apiErrorHendler(data.error);
        }
      }
      return data;
    }).catch(err => {
      if (this.apiErrorHendler) this.apiErrorHendler('Failed to fetch data from backend server');
      return console.error(err);
    });
  }
  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    if (str.length) return "?" + str.join("&");
    return "";
  }
  get(path, data) {
    return this.request("GET", path, data);
  }
  post(path, data) {
    return this.request("POST", path, data);
  }

  constructor() {
    ["products"].forEach(fnName => {
      this[fnName] = this[fnName].bind(this);
    });
  }

  products(filter = {}, page = 1, limit = 10) {
    return this.get("/products", { ...filter, page, limit });
  }

  product(product_id) {
    return this.get("/products/" + product_id, {});
  }
  initalData() {
    return this.get("/initial-data", {});
  }
  paiement(data) {
    return this.post("/paiement", data);
  }
}
