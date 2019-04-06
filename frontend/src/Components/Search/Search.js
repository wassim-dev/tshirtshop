import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";
import { connect } from "react-redux";

function Search({ store, dispatch }) {
  return (
    <div>
      <Paper
        style={{
          padding: "2px 2px 2px 10px",
          display: "flex",
          margin: "10px 0",
          alignItems: "center"
        }}
        elevation={1}
      >
        <InputBase
          placeholder="Search"
          style={{ flex: 1 }}
          value={store.searchQuery}
          onChange={e => dispatch("SET_SEARCH_QUERY", e.target.value)}
        />
        <IconButton
          aria-label="Search"
          onClick={() => {
            dispatch("SEARCH");
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Paper elevation={1} style={{ padding: "3px 15px 7px 15px" }}>
        <div className="search">
          {store.activeDepartment && (
            <div>
              <Typography variant="h5" component="h3" style={{ marginTop: 15 }}>
                Categories
              </Typography>
              <List component="nav">
                {store.categorys
                  .filter(
                    cat =>
                      cat.department_id === store.activeDepartment.department_id
                  )
                  .map((cat, i) => {
                    return (
                      <NavLink to={cat.url} key={cat.category_id}>
                        <ListItem
                          button
                          selected={
                            cat.category_id ===
                            (store.activeCategory &&
                              store.activeCategory.category_id)
                          }
                        >
                          <ListItemText primary={cat.name} />
                        </ListItem>
                      </NavLink>
                    );
                  })}
              </List>
            </div>
          )}

          {store.attributes.map(attr => {
            return (
              <div key={attr.attribute_id}>
                <Typography
                  variant="h5"
                  component="h3"
                  style={{ marginTop: 15 }}
                >
                  {attr.name}
                </Typography>
                <ul>
                  {attr.values.map(val => {
                    return (
                      <li
                        key={
                          val.attribute_value_id +
                          "-" +
                          (val.checked ? "checked" : "notchecked")
                        }
                      >
                        <FormControlLabel
                          style={{ marginLeft: 0 }}
                          control={
                            <Checkbox
                              style={{ padding: 5 }}
                              checked={val.checked}
                              onChange={e => {
                                dispatch("CHECK_ATTRIBUTE", {
                                  id: val.attribute_value_id,
                                  checked: e.target.checked
                                });
                              }}
                              value={"id:" + val.attribute_value_id}
                            />
                          }
                          label={val.value}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Paper>
    </div>
  );
}
export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(Search);
