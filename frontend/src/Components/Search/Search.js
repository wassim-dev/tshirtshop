import React, { useContext, useState, useEffect } from "react";
import Categorys from "../Categorys/Categorys";
import ShopContext from "../../Context/ShopContext";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});
export default withStyles(styles)(function Search(props) {
  const { attributes } = useContext(ShopContext);
  const [update, setUpdate] = useState(0);
  const [q, setQ] = useState("");
  const [qTime, setQTime] = useState(null);
  const { classes } = props;
  const listIds = [];
  attributes.map(attr => {
    attr.values.map(val => {
      if (val.checked) {
        listIds.push(val.attribute_value_id);
      }
      return val;
    });
    return attr;
  });

  useEffect(() => {
    if (props.onChange)
      props.onChange({
        attrs: listIds,
        q: q
      });
  }, [listIds.length]);

  useEffect(() => {
    if (props.onChange) {
      if (qTime) {
        clearTimeout(qTime);
      }
      setQTime(
        setTimeout(
          () =>
            props.onChange({
              attrs: listIds,
              q: q
            }),
          500
        )
      );
    }
  }, [q]);

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
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <IconButton
          aria-label="Search"
          onClick={() => {
            if (props.onChange) {
              props.onChange({
                attrs: listIds,
                q: q
              });
            }
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Paper className={classes.root} elevation={1}>
        <div className="search">
          {props.department && (
            <div>
              <Typography variant="h5" component="h3" style={{ marginTop: 15 }}>
                Categories
              </Typography>
              <Categorys
                department={props.department}
                category={props.category}
              />
            </div>
          )}

          {attributes.map(attr => {
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
                                val.checked = e.target.checked;
                                setUpdate(update + 1);
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
});
