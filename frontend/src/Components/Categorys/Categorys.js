import React, { useContext } from "react";
import ShopContext from "../../Context/ShopContext";
import { NavLink } from "react-router-dom";
import { List, ListItem, ListItemText } from "@material-ui/core";

export default function Categorys(props) {
  const shop = useContext(ShopContext);
  let categorys = shop.categorys.filter(
    item =>
      item.department_id ===
      (props.department && props.department.department_id)
  );
  return (
    <List component="nav">
      {categorys.map((cat, i) => {
        return (
          <NavLink to={cat.url} key={i}>
            <ListItem button selected={cat.active}>
              <ListItemText primary={cat.name} />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
}
