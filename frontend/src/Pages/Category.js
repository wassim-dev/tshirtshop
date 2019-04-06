import React, { useEffect } from "react";
import { Products, Search, Loading } from "../Components";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import { NavLink } from "react-router-dom";
import NotFound from "./NotFound";
import { connect } from "react-redux";

function Category({ store, dispatch, match }) {
  useEffect(() => {
    dispatch("SELECT_CATEGORY_BY_URL", match.url);
  }, [match.url, store.isLoading]);
  useEffect(() => {
    if (store.activeCategory) {
      document.title =
        store.activeCategory.name +
        " | " +
        store.activeDepartment.name +
        " TshirtShop";
    }
  }, [store.activeCategory]);

  if (store.notFound) return <NotFound />;
  if (!store.activeCategory) return <Loading />;
  return (
    <div>
      <Paper style={{ padding: 10, margin: "10px 0" }}>
        <Breadcrumbs aria-label="Breadcrumb">
          <NavLink color="inherit" to="/">
            Home
          </NavLink>
          <NavLink color="inherit" to={store.activeDepartment.url}>
            {store.activeDepartment.name}
          </NavLink>
          <Typography color="textPrimary">
            {store.activeCategory.name}
          </Typography>
        </Breadcrumbs>
      </Paper>

      <div className="contentpage">
        <Search />
        <Products />
      </div>
    </div>
  );
}

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(Category);
