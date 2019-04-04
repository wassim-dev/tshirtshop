import React, { useContext, useEffect, useState } from "react";
import { Products, Search, Loading } from "../Components";
import ShopContext from "../Context/ShopContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import { NavLink } from "react-router-dom";
import NotFound from "./NotFound";

export default function Department(props) {
  const [args, setArgs] = useState({
    attrs: [],
    q: ""
  });
  const { departments, selectDepartementByURL, isLoading } = useContext(
    ShopContext
  );

  selectDepartementByURL(props.match.url);
  let department = departments.find(({ url }) => url === props.match.url);
  useEffect(() => {
    if (department) {
      document.title = department.name + " | TshirtShop";
    }
  }, [department]);

  if (!isLoading && !department) return <NotFound />;
  if (!department) return <Loading />;

  return (
    <div>
      <Paper style={{ padding: 10, margin: "10px 0" }}>
        <Breadcrumbs aria-label="Breadcrumb">
          <NavLink color="inherit" to="/">
            Home
          </NavLink>
          <Typography color="textPrimary">{department.name}</Typography>
        </Breadcrumbs>
      </Paper>
      <div className="contentpage">
        <Search department={department} onChange={arg => setArgs(arg)} />
        <Products
          key={"dep-" + department.department_id}
          department={department.department_id}
          attrs={args.attrs}
          q={args.q}
        />
      </div>
    </div>
  );
}
