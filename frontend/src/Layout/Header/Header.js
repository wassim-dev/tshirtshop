import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { FirebaseAuth, Cart } from "../../Components";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Link } from "react-router-dom";
import "./Header.css";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import config from "../../config";
import { connect } from "react-redux";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(MuiDialogContent);

function Header({ store, dispatch }) {
  const [cartDialogState, setCartDialogState] = useState(false);
  const [sideNavState, setSideNavState] = useState(false);
  const { departments, carts } = store;
  useEffect(() => {
    if (carts.length === 0 && cartDialogState && !store.orderSent) {
      setCartDialogState(false);
    }
  }, [carts.length]);

  return (
    <>
      <div>
        <div className="app-bar">
          <div className="container app-bar-container">
            <img
              className="logo"
              src="/images/tshirtshop.png"
              alt="tshirtshop"
            />
            <span style={{ flex: 1 }} />
            <Hidden only={["xs", "sm"]}>
              <Button color="default" component={Link} to="/">
                Home
              </Button>
              {departments.map(dep => {
                return (
                  <Button
                    color={
                      dep.department_id ===
                      (store.activeDepartment &&
                        store.activeDepartment.department_id)
                        ? "secondary"
                        : "default"
                    }
                    component={Link}
                    to={dep.url}
                    key={dep.department_id}
                  >
                    {dep.name}
                  </Button>
                );
              })}
            </Hidden>
            <IconButton
              disabled={!carts.length}
              aria-label="Cart"
              className="header-btn-cart"
              onClick={() => setCartDialogState(true)}
            >
              <Badge badgeContent={carts.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Hidden only={["xs"]}>
              <FirebaseAuth />
            </Hidden>
            <Hidden only={["md", "lg", "xl"]}>
              <IconButton
                aria-label="Menu"
                onClick={() => setSideNavState(true)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Hidden>
          </div>
        </div>
      </div>
      <Dialog
        open={cartDialogState}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setCartDialogState(false)}
        >
          Cart
        </DialogTitle>
        <DialogContent>
          <StripeProvider apiKey={config.STRIPE_PK}>
            <Elements>
              <Cart key={carts.length} />
            </Elements>
          </StripeProvider>
        </DialogContent>
      </Dialog>

      <Drawer
        anchor="right"
        open={sideNavState}
        onClose={() => setSideNavState(false)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={() => setSideNavState(false)}
          onKeyDown={() => setSideNavState(false)}
        >
          <div style={{ minWidth: 250 }}>
            <List>
              <ListItem button key={0} component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItem>
              {departments.map((dep, index) => (
                <ListItem
                  button
                  key={dep.department_id}
                  color={dep.active ? "secondary" : "default"}
                  component={Link}
                  to={dep.url}
                >
                  <ListItemText primary={dep.name} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(Header);
