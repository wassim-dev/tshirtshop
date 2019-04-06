import React from "react";
import apiClass from "./Api";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
let carts = reactLocalStorage.getObject("carts");
let userInfos = reactLocalStorage.getObject("user");
let api = new apiClass();
const initalState = {
  isLoading: true,
  departments: [],
  activeDepartment: null,
  categorys: [],
  activeCategory: null,
  attributes: [],
  shippings: [],
  taxs: [],
  user: userInfos.user ? userInfos.user : null,
  openLoginDialogState: false,
  isLoadingProducts: false,
  isLoadingProductDetails: false,
  filter: {},
  productsRows: [],
  activeProduct: null,
  page: 1,
  nbrPages: 0,
  limitParPage: 12,
  orderSent: false,
  error: false,
  notFound: false,
  searchQuery: "",
  carts: carts.list || []
};
const dispatch = (type, payload = null) => {
  setTimeout(() => store.dispatch({ type, payload }));
};
let timeOutSearchQuery = null;
const Reducer = (oldState = initalState, action) => {
  let state = {};
  switch (action.type) {
    case "SET_STORE":
      state = action.payload;
      break;
    case "LOAD_INITAL_DATA":
      state.notFound = false;
      state.isLoading = true;
      api.initalData().then(data => {
        if (!data) return;
        dispatch("SET_STORE", { ...data, isLoading: false });
      });
      break;
    case "HOME_PAGE":
      state.notFound = false;
      state.activeCategory = null;
      state.activeDepartment = null;
      dispatch("SET_FILTER", {
        attribute_value_ids: oldState.filter.attribute_value_ids || ""
      });
      break;
    case "SET_FILTER":
      state.filter = action.payload || {};
      dispatch("GO_TO_PAGE", 1);
      break;
    case "GO_TO_PAGE":
      state.notFound = false;
      state.isLoadingProducts = true;
      api
        .products(oldState.filter, action.payload || 1, oldState.limitParPage)
        .then(data => {
          dispatch("SET_STORE", {
            isLoadingProducts: false,
            page: data.page || 1,
            nbrPages: data.nbrPages || 0,
            productsRows: data.rows || []
          });
          scrollToTop();
        });
      break;
    case "LOAD_PRODUCT_DETAILS":
      state.notFound = false;
      state.isLoadingProductDetails = true;
      state.activeProduct = oldState.productsRows.find(
        product => product.product_id === action.payload
      );
      api.product(action.payload).then(data => {
        dispatch("SET_STORE", {
          isLoadingProductDetails: false,
          activeProduct: data
        });
      });
      break;
    case "SELECT_DEPARTMENT_BY_URL":
      state.activeDepartment = oldState.departments.find(
        ({ url }) => url === action.payload
      );
      state.notFound = !state.activeDepartment;
      if (state.activeDepartment) {
        dispatch("SET_FILTER", {
          attribute_value_ids: oldState.filter.attribute_value_ids || "",
          department_id: state.activeDepartment.department_id
        });
      }
      state.activeCategory = null;
      break;
    case "SELECT_CATEGORY_BY_URL":
      state.activeCategory = oldState.categorys.find(
        ({ url }) => url === action.payload
      );
      state.activeDepartment = state.activeCategory
        ? oldState.departments.find(
            ({ department_id }) =>
              department_id === state.activeCategory.department_id
          )
        : null;
      state.notFound = !state.activeCategory;
      if (state.activeCategory) {
        dispatch("SET_FILTER", {
          attribute_value_ids: oldState.filter.attribute_value_ids || "",
          category_id: state.activeCategory.category_id
        });
      }
      break;
    case "CHECK_ATTRIBUTE":
      let ids = [];
      state.attributes = oldState.attributes.map(attr => {
        attr.values = attr.values.map(val => {
          if (val.attribute_value_id === action.payload.id) {
            val.checked = action.payload.checked;
          }
          if (val.checked) {
            ids.push(val.attribute_value_id);
          }
          return val;
        });
        return attr;
      });
      dispatch("SET_FILTER", {
        ...oldState.filter,
        attribute_value_ids: ids.join(",")
      });
      break;
    case "SET_SEARCH_QUERY":
      state.searchQuery = action.payload;
      if (timeOutSearchQuery) clearTimeout(timeOutSearchQuery);
      timeOutSearchQuery = setTimeout(() => {
        dispatch("SEARCH");
      }, 500);
      break;
    case "SEARCH":
      dispatch("SET_FILTER", { ...oldState.filter, q: oldState.searchQuery });
      break;
    case "ADD_TO_CART":
      let choiceId =
        oldState.activeProduct.product_id +
        "-" +
        action.payload
          .map(val => val.attribute_id + ":" + val.attribute_value_id)
          .join("-");
      let listProductsInCarts = oldState.carts || [];
      let found = false;
      listProductsInCarts = listProductsInCarts.map(row => {
        if (row.choiceId === choiceId) {
          found = true;
          row.qte += 1;
        }
        return row;
      });
      if (!found) {
        listProductsInCarts.push({
          ...oldState.activeProduct,
          choiceId,
          choice: action.payload,
          qte: 1
        });
      }
      reactLocalStorage.setObject("carts", { list: listProductsInCarts });
      dispatch("SET_STORE", { orderSent: false, carts: listProductsInCarts });
      break;
    case "CLEAR_CART":
      reactLocalStorage.setObject("carts", { list: [] });
      dispatch("SET_STORE", { orderSent: true, carts: [] });
      break;
    case "SET_QTE":
      let listProductsCart = oldState.carts || [];
      if (action.payload.qte > 0) {
        listProductsCart = listProductsCart.map(row => {
          if (row.choiceId === action.payload.choiceId) {
            row.qte = action.payload.qte;
          }
          return row;
        });
      } else {
        listProductsCart = listProductsCart.filter(
          row => row.choiceId !== action.payload.choiceId
        );
      }
      reactLocalStorage.setObject("carts", { list: listProductsCart });
      dispatch("SET_STORE", { orderSent: false, carts: listProductsCart });
      break;
    case "SET_USER":
      state.user = action.payload;
      reactLocalStorage.setObject("user", { user: state.user });
      break;
    case "LOGOUT":
      state.user = null;
      break;
    default:
      break;
  }
  return { ...oldState, ...state };
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

const store = createStore(Reducer);
dispatch("LOAD_INITAL_DATA");
export default props => <Provider store={store}>{props.children}</Provider>;
