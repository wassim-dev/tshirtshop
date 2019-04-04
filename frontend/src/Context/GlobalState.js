import React, { Component, useState, useEffect } from "react";
import ShopContext from "./ShopContext";
import { reactLocalStorage } from "reactjs-localstorage";
import api from "./Api";
import { Loading } from "../Components";

export default class GlobalState extends Component {
  constructor(props) {
    super(props);
    let carts = reactLocalStorage.getObject("carts");
    let userInfos = reactLocalStorage.getObject("user");
    this.state = {
      isLoading: true,
      departments: [],
      categorys: [],
      attributes: [],
      shippings: [],
      taxs: [],
      user: userInfos.user ? userInfos.user : null,
      openLoginDialogState: false,
      orderSent: false,
      error: false,
      carts: (carts.list || []).map(this.initCartItem.bind(this))
    };
    this.api = new api();
    this.api.apiErrorHendler = this.apiErrorHendler.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.selectDepartementByURL = this.selectDepartementByURL.bind(this);
    this.selectCategoryByURL = this.selectCategoryByURL.bind(this);
    this.initProductObj = this.initProductObj.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setStateLoginDialog = this.setStateLoginDialog.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.initCartItem = this.initCartItem.bind(this);
    this.unselectDepartementAndCategory = this.unselectDepartementAndCategory.bind(
      this
    );
  }
  apiErrorHendler(errorMessage) {
    this.setState({ ...this.state, error: "" + errorMessage });
  }
  componentDidMount() {
    this.loadInitalData();
  }

  loadInitalData() {
    this.api.initalData().then(data => {
      if (!data) return;
      data.departments = (data.departments || []).map(item =>
        this.initDepartmentObj(item)
      );
      data.categorys = (data.categorys || []).map(item =>
        this.initCategoryObj(item)
      );
      this.setState({ ...this.state, ...data, isLoading: false });
    });
  }

  setUser(user) {
    if (!user) {
      this.setState({ user });
      reactLocalStorage.setObject("user", { user });
      return;
    }
    this.api
      .request("post", "/session", { idToken: user.idToken || "" })
      .then(rep => {
        if (rep.verified) {
          localStorage.setItem("sessionid", rep.sessionid);
          this.setState({ user });
          reactLocalStorage.setObject("user", { user });
        }
      });
  }
  clearCart() {
    this.setState({ orderSent: true, carts: [] });
    reactLocalStorage.setObject("carts", { list: [] });
  }
  initDepartmentObj(item) {
    const self = this;
    item.select = () => {
      self.setState({
        departments: this.state.departments.map(elm => {
          elm.active = elm.department_id === item.department_id;
          return elm;
        })
      });
    };
    return item;
  }

  initCategoryObj(item) {
    const self = this;
    item.select = () => {
      self.setState({
        categorys: this.state.categorys.map(elm => {
          elm.active = elm.category_id === item.category_id;
          if (elm.active) {
            let departement = this.state.departments.find(
              dep => dep.department_id === elm.department_id
            );
            if (departement) departement.select();
          }
          return elm;
        })
      });
    };
    return item;
  }

  initCartItem(cartItem) {
    const self = this;
    cartItem.setQte = qte => {
      let listProductsInCarts = this.state.carts || [];
      if (qte && qte > 0) {
        cartItem.qte = qte;
        listProductsInCarts = listProductsInCarts.map(item => {
          if (item.choiceId === cartItem.choiceId) {
            item.qte = qte;
          }
          return item;
        });
      } else {
        listProductsInCarts = listProductsInCarts.filter(
          item => item.choiceId !== cartItem.choiceId
        );
      }
      reactLocalStorage.setObject("carts", { list: listProductsInCarts });
      self.setState({ orderSent: false, carts: listProductsInCarts });
    };
    return cartItem;
  }
  initProductObj(item) {
    const self = this;
    item.isLoading = false;
    item.qte = item.qte ? item.qte : 0;
    if (this.state && this.state.carts) {
      item.qte = 0;
      this.state.carts.map(({ product_id, qte }) => {
        if (product_id === item.product_id) {
          item.qte += qte;
        }
        return item;
      });
    }
    item.loadAttributes = () => {
      if (item.hasAttribute) return item;
      return this.getProduct(item.product_id);
    };
    item.addToCart = choice => {
      let choiceId =
        item.product_id +
        "-" +
        choice.choiceList
          .map(val => val.attribute_id + ":" + val.attribute_value_id)
          .join("-");
      let listProductsInCarts = this.state.carts || [];
      let found = false;
      listProductsInCarts = listProductsInCarts.map(row => {
        if (row.choiceId === choiceId) {
          found = true;
          row.qte += 1;
        }
        return row;
      });
      if (!found) {
        listProductsInCarts.push(
          self.initCartItem({
            ...item,
            choiceId,
            choice: choice.choiceList,
            qte: 1
          })
        );
      }
      reactLocalStorage.setObject("carts", { list: listProductsInCarts });
      self.setState({ orderSent: false, carts: listProductsInCarts });
    };

    return item;
  }

  getProducts(props) {
    const self = this;
    let [dataProducts, setDataProducts] = useState({
      count: 0,
      page: 1,
      limit: 12,
      nbrPages: 1,
      loading: true,
      rows: []
    });
    let isMounted = true;
    let fetchProducts = page => {
      const handleDataReceived = data => {
        if (!isMounted) return;
        data.rows = data.rows.map(self.initProductObj);
        data.loading = false;
        data.goToPage = i => {
          if (data.loading) return;
          data.loading = true;
          fetchProducts(i);
        };
        setDataProducts(data);
      };
      let timeOut = null;
      const scrollToTop = () => {
        if (
          document.body.scrollTop !== 0 ||
          document.documentElement.scrollTop !== 0
        ) {
          window.scrollBy(0, -50);
          timeOut = setTimeout(() => scrollToTop(), 10);
        } else clearTimeout(timeOut);
      };

      if (props.inCarts) {
        let data = { ...dataProducts };
        let startAtIndex = (page - 1) * dataProducts.limit;
        let endAtIndex = Math.min(
          self.state.carts.length,
          startAtIndex + dataProducts.limit
        );
        data.rows = self.state.carts.slice(startAtIndex, endAtIndex);
        handleDataReceived(data);
      } else {
        let filter = {};
        if (props.category) filter.category_id = props.category;
        if (props.department) filter.department_id = props.department;
        if (props.q) filter.q = props.q;
        if (props.attrs && props.attrs.length)
          filter.attribute_value_ids = props.attrs.join(",");
        self.api.products(filter, page, dataProducts.limit).then(data => {
          handleDataReceived(data);
          scrollToTop();
          return data;
        });
      }
      return () => {
        isMounted = false;
      };
    };
    useEffect(() => fetchProducts(1), [
      props.category,
      props.department,
      props.inCarts,
      props.q || "",
      (props.attrs || []).length,
      self.state.orderSent
    ]);
    return dataProducts;
  }

  getProduct(product_id) {
    const self = this;
    let [dataProduct, setDataProduct] = useState({
      product_id,
      hasAttribute: true,
      isLoading: true
    });
    useEffect(() => {
      self.api.product(product_id).then(data => {
        data.isLoading = false;
        data.hasAttribute = true;
        self.initProductObj(data);
        setDataProduct(data);
      });
    }, [product_id]);
    return dataProduct;
  }
  unselectDepartementAndCategory() {
    useEffect(
      () =>
        this.setState({
          departments: this.state.departments.map(elm => {
            elm.active = false;
            return elm;
          }),
          categorys: this.state.categorys.map(elm => {
            elm.active = false;
            return elm;
          })
        }),
      []
    );
  }

  selectDepartementByURL(url) {
    useEffect(() => {
      let department = this.state.departments.find(elm => elm.url === url);
      if (department) department.select();
    }, [url, this.state.isLoading]);
  }

  selectCategoryByURL(url) {
    useEffect(() => {
      let category = this.state.categorys.find(elm => elm.url === url);
      if (category) category.select();
    }, [url, this.state.isLoading]);
  }

  setStateLoginDialog(value = true) {
    this.setState({ openLoginDialogState: value });
  }

  render() {
    if (this.state.error) {
      return <div className="errorContainer">{this.state.error}</div>;
    }

    return (
      <ShopContext.Provider
        value={{
          departments: this.state.departments,
          categorys: this.state.categorys,
          attributes: this.state.attributes,
          isLoading: this.state.isLoading,
          carts: this.state.carts,
          shippings: this.state.shippings,
          taxs: this.state.taxs,
          getProducts: this.getProducts,
          getProduct: this.getProduct,
          selectDepartementByURL: this.selectDepartementByURL,
          selectCategoryByURL: this.selectCategoryByURL,
          user: this.state.user,
          openLoginDialogState: this.state.openLoginDialogState,
          setStateLoginDialog: this.setStateLoginDialog,
          unselectDepartementAndCategory: this.unselectDepartementAndCategory,
          setUser: this.setUser,
          clearCart: this.clearCart,
          orderSent: this.state.orderSent
        }}
      >
        {this.state.isLoading ? <Loading /> : this.props.children}
      </ShopContext.Provider>
    );
  }
}
