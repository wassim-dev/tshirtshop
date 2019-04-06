import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import {
  Fab,
  Dialog,
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton
} from "@material-ui/core";
import { connect } from "react-redux";
import Loading from "../Loading/Loading";
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

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit
  }
}))(MuiDialogActions);

const FormAttrs = connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(({ store, onChange }) => {
  const [update, setUpdate] = useState(0);
  let { attributes } = store.activeProduct;
  useEffect(() => {
    if (onChange) {
      let choiceList = (attributes || [])
        .filter(attr => !!attr.selected)
        .map(attr => ({
          ...attr.values.find(
            val => "id" + val.attribute_value_id === attr.selected
          ),
          name: attr.name
        }));
      onChange({
        choice: choiceList.length === (attributes || []).length,
        choiceList
      });
    }
  }, [update]);

  return (
    <div className="FormAttrs">
      <p>Please choose the product characteristics :</p>
      {attributes.map(attr => {
        return (
          <div key={attr.attribute_id}>
            <Typography variant="h5" component="h3" style={{ marginTop: 15 }}>
              {attr.name}
            </Typography>

            <RadioGroup
              value={attr.selected}
              onChange={e => {
                attr.selected = e.target.value;
                setUpdate(update + 1);
              }}
            >
              <ul>
                {attr.values.map(val => {
                  return (
                    <li key={val.attribute_value_id}>
                      <FormControlLabel
                        style={{ marginLeft: 0 }}
                        control={
                          <Radio
                            checked={
                              attr.selected === "id" + val.attribute_value_id
                            }
                            value={"id" + val.attribute_value_id}
                          />
                        }
                        label={val.value}
                      />
                    </li>
                  );
                })}
              </ul>
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
});

const BuyNow = ({ store, dispatch, product }) => {
  const [buyProductDialogState, setBuyProductDialogState] = useState(false);
  const [selectedAttrs, setSelectedAttrs] = useState({
    choice: false,
    choiceList: []
  });

  const BuyNowClick = () => {
    if (
      !store.activeProduct ||
      product.product_id !== store.activeProduct.product_id
    ) {
      dispatch("LOAD_PRODUCT_DETAILS", product.product_id);
    }
    setBuyProductDialogState(true);
  };

  return (
    <div>
      <Fab
        className="fab-buy-now"
        size="small"
        variant="extended"
        color="secondary"
        aria-label="BUY NOW"
        onClick={BuyNowClick}
      >
        BUY NOW
      </Fab>
      <Dialog
        open={buyProductDialogState}
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setBuyProductDialogState(false)}
        >
          {product.name}
        </DialogTitle>
        <DialogContent>
          {store.isLoadingProductDetails ? (
            <Loading />
          ) : (
            <FormAttrs onChange={attrs => setSelectedAttrs(attrs)} />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBuyProductDialogState(false)}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setBuyProductDialogState(false);
              dispatch("ADD_TO_CART", selectedAttrs.choiceList);
            }}
            color="primary"
            variant="contained"
            disabled={!selectedAttrs.choice}
          >
            Add To Cart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(BuyNow);
