import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../Context/ShopContext";
import { Products, Search, Loading } from "../Components";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import { NavLink } from "react-router-dom";
import NotFound from "./NotFound";

export default function Category(props) {
  const [args, setArgs] = useState({
    attrs: [],
    q: ""
  });
  const { category, department, isLoading } = getCurrentStateByUrl(
    props.match.url
  );
  useEffect(() => {
    if (category && department) {
      document.title = category.name + " | " + department.name + " TshirtShop";
    }
  }, [category, department]);

  if (isLoading) {
    return <Loading />;
  } else if (!department || !category) {
    return <NotFound />;
  } else {
    return (
      <div>
        <Paper style={{ padding: 10, margin: "10px 0" }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <NavLink color="inherit" to="/">
              Home
            </NavLink>
            {department && (
              <NavLink color="inherit" to={department.url}>
                {department.name}
              </NavLink>
            )}
            <Typography color="textPrimary">{category.name}</Typography>
          </Breadcrumbs>
        </Paper>

        <div className="contentpage">
          <Search
            category={category}
            department={department}
            onChange={arg => setArgs(arg)}
          />
          <Products
            category={category.category_id}
            attrs={args.attrs}
            q={args.q}
          />
        </div>
      </div>
    );
  }
}

function getCurrentStateByUrl(url) {
  const shop = useContext(ShopContext);
  const category = shop.categorys.find(elm => elm.url === url);
  useEffect(() => category && category.select(), [
    category && category.category_id
  ]);
  if (!category) {
    return {
      ...shop,
      category: null,
      department: null
    };
  }
  const department = shop.departments.find(elm => elm.active);
  return {
    ...shop,
    category,
    department
  };
}
