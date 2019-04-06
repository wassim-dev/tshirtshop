import React, { useEffect } from "react";
import { Products, Search } from "../Components";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(function Home(props) {
  useEffect(() => {
    props.dispatch("HOME_PAGE");
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
        <Search />
        <Products />
      </div>
    </div>
  );
});
