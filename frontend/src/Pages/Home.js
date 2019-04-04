import React, { useState, useContext, useEffect } from "react";
import { Products, Search } from "../Components";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import { NavLink } from "react-router-dom";
import ShopContext from "../Context/ShopContext";
export default function Home(props) {
  const [args, setArgs] = useState({
    attrs: [],
    q: ""
  });
  const { unselectDepartementAndCategory } = useContext(ShopContext);
  unselectDepartementAndCategory();
  useEffect(() => {
    document.title = "Home | TshirtShop";
  }, []);
  return (
    <div>
      <Paper style={{ padding: 10, margin: "10px 0" }}>
        <Breadcrumbs aria-label="Breadcrumb">
          <NavLink color="inherit" to="/">
            Home
          </NavLink>
        </Breadcrumbs>
      </Paper>
      <div className="contentpage">
        <Search onChange={arg => setArgs(arg)} />
        <Products attrs={args.attrs} q={args.q} />
      </div>
    </div>
  );
}
