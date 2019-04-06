import React from "react";
import Pagination from "../Pagination/Pagination";
import Product from "./Product";
import Loading from "../Loading/Loading";
import { connect } from "react-redux";

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(function Products({ store, dispatch }) {
  return (
    <div className="products">
      {store.isLoadingProducts ? (
        <div className="loading">
          <Loading />
        </div>
      ) : null}
      <div className="product-list">
        {store.productsRows.map(product => {
          return <Product key={product.product_id} value={product} />;
        })}
      </div>
      <Pagination
        page={store.page}
        nbrPages={store.nbrPages}
        goToPage={i => dispatch("GO_TO_PAGE", i)}
        limitPages={2}
      />
    </div>
  );
});
