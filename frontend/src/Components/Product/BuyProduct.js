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

const FormAttrs = ({ product, onChange }) => {
  const [update, setUpdate] = useState(0);
  const { isLoading, attributes } = product.loadAttributes();
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
  }, [update, isLoading]);
  if (isLoading) return <div>Loading ...</div>;

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
};

export default ({ product }) => {
  const [buyProductDialogState, setBuyProductDialogState] = useState(false);
  const [selectedAttrs, setSelectedAttrs] = useState({
    choice: false,
    choiceList: []
  });

  return (
    <div>
      <Fab
        className="fab-buy-now"
        size="small"
        variant="extended"
        color="secondary"
        aria-label="BUY NOW"
        onClick={() => setBuyProductDialogState(true)}
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
          <FormAttrs
            product={product}
            onChange={attrs => setSelectedAttrs(attrs)}
          />
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
              product.addToCart(selectedAttrs);
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
