import React, { useContext } from "react";
import Pagination from "../Pagination/Pagination";
import ShopContext from "../../Context/ShopContext";
import Product from "./Product";
import Loading from "../Loading/Loading";

export default function Products(props) {
  const { getProducts } = useContext(ShopContext);
  const { page, nbrPages, loading, rows, goToPage } = getProducts(props);
  return (
    <div className="products">
      {loading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : null}
      <div className="product-list">
        {props.item
          ? rows.map(product => props.item(product))
          : rows.map(product => {
              return <Product key={product.product_id} value={product} />;
            })}
      </div>
      <Pagination
        page={page}
        nbrPages={nbrPages}
        goToPage={i => goToPage(i)}
        limitPages={2}
      />
    </div>
  );
}
