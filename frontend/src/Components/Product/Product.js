import React from "react";
import Fab from "@material-ui/core/Fab";
import { NavLink } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import BuyProduct from "./BuyProduct";

import "./style.css";

export default function Product({ value }) {
  const { name, url, thumbnail, qte, setQte, price } = value;
  return (
    <div className="product">
      <NavLink to={url}>
        <img src={thumbnail} className="product-image" alt={name} />
      </NavLink>
      <NavLink to={url} style={{ flex: 1 }}>
        <span className="product-title">{name}</span>
      </NavLink>

      {qte && false ? (
        <div style={{ display: "flex" }}>
          <Fab
            size="small"
            color="default"
            aria-label="Add"
            onClick={() => setQte(qte - 1)}
          >
            <RemoveIcon />
          </Fab>
          <Fab
            size="small"
            color="default"
            aria-label="Remove"
            style={{ margin: "0 5px" }}
          >
            {qte}
          </Fab>
          <Fab
            size="small"
            color="default"
            aria-label="Remove"
            onClick={() => setQte(qte + 1)}
          >
            <AddIcon />
          </Fab>
        </div>
      ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minWidth: 200
            }}
          >
            <span style={{ paddingLeft: 20 }}>${price}</span>
            <span>
              <BuyProduct product={value} />
            </span>
          </div>
        )}
    </div>
  );
}
