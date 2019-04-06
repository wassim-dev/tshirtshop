import React, { useState } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { injectStripe, CardElement } from "react-stripe-elements";
import api from "../../Context/Api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";

const Cart = injectStripe(props => {
  const { store, dispatch } = props;
  const { shippings, carts, orderSent } = store;
  const [activeStep, setActiveStep] = useState(orderSent ? 3 : 0);
  const [disabledNext, setDisabledNext] = useState(false);
  const [infos, setInfos] = useState({
    shipping_id: "1",
    shippingError: false,
    shipping_value_id: "",
    shippingValueError: false,
    name: "",
    nameError: false
  });
  const steps = ["Shoping", "Confirmation", "Paiement", "Finish"];
  const submit = async ev => {
    setDisabledNext(true);
    if (!infos.name) {
      setInfos({ ...infos, nameError: true });
      setDisabledNext(false);
      return;
    }
    let products = carts.map(({ product_id, choice, qte }) => ({
      product_id,
      choice,
      qte
    }));
    let { token } = await props.stripe.createToken({ name: infos.name });
    if (!token || !token.id) {
      setDisabledNext(false);
      return;
    }
    let rep = await new api().paiement({
      token: token.id,
      products,
      shipping_id: infos.shipping_id
    });
    setDisabledNext(false);
    if (rep && rep.success) {
      handleNext(true);
      dispatch("CLEAR_CART");
    }
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleChange = name => event => {
    if (name === "shipping_id") {
      setInfos({
        ...infos,
        shipping_value_id: 0,
        shipping_id: event.target.value
      });
    } else {
      setInfos({
        ...infos,
        [name]: event.target.value
      });
    }
  };
  const handleNext = valid => {
    switch (activeStep) {
      case 0:
        break;
      case 1:
        if (!infos.shipping_id || infos.shipping_id * 1 <= 1) {
          setInfos({ shippingError: true });
          return;
        }
        break;
      case 2:
        if (!valid) {
          submit();
          return;
        }
        break;
      case 3:
        break;
      default:
        break;
    }
    setActiveStep(activeStep + 1);
  };

  let total = 0;
  total = carts.reduce((accumulator, { qte, price }) => {
    accumulator += price * qte;
    return accumulator;
  }, 0);

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const props = {};
          const labelProps = {};
          props.completed = index < activeStep;
          return (
            <Step key={label} {...props}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === 0 ? (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Attributes</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carts.map(row => (
                  <TableRow key={row.product_id}>
                    <TableCell component="th" scope="row">
                      <IconButton
                        size="small"
                        style={{ zoom: "0.7", marginRight: 5 }}
                        aria-label="Remove"
                        onClick={e => row.setQte(0)}
                      >
                        <CloseIcon />
                      </IconButton>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        {(row.choice || []).map((val, i) => (
                          <div key={i}>
                            {val.name} : {val.value}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell align="right">{"$" + row.price}</TableCell>
                    <TableCell component="th" scope="row">
                      <div style={{ display: "flex", zoom: "0.7" }}>
                        <Fab
                          size="small"
                          aria-label="Add"
                          onClick={() =>
                            dispatch("SET_QTE", {
                              choiceId: row.choiceId,
                              qte: row.qte - 1
                            })
                          }
                        >
                          <RemoveIcon />
                        </Fab>
                        <Fab
                          size="small"
                          aria-label="Remove"
                          style={{ margin: "0 5px" }}
                        >
                          {row.qte}
                        </Fab>
                        <Fab
                          size="small"
                          aria-label="Remove"
                          onClick={() =>
                            dispatch("SET_QTE", {
                              choiceId: row.choiceId,
                              qte: row.qte + 1
                            })
                          }
                        >
                          <AddIcon />
                        </Fab>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {"$" + (row.price * row.qte).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div
              style={{
                margin: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <div style={{ padding: 20 }}>
                Total : {"$" + total.toFixed(2)}
              </div>
            </div>
          </div>
        ) : null}
        {activeStep === 1 ? (
          <div>
            <div className="formCtrl">
              <TextField
                error={infos.shippingError}
                select
                label="Shipping"
                helperText="Please select a shipping"
                margin="normal"
                variant="outlined"
                onChange={handleChange("shipping_id")}
                value={infos.shipping_id}
              >
                {shippings.map(option => (
                  <MenuItem
                    key={option.shipping_region_id}
                    value={option.shipping_region_id}
                  >
                    {option.shipping_region}
                  </MenuItem>
                ))}
              </TextField>

              {(
                shippings.find(
                  shipping => shipping.shipping_region_id === infos.shipping_id
                ) || { values: [] }
              ).values.length > 0 && (
                <TextField
                  error={infos.shippingValueError}
                  select
                  label="Shipping"
                  helperText="Please select a shipping"
                  margin="normal"
                  variant="outlined"
                  onChange={handleChange("shipping_value_id")}
                  value={infos.shipping_value_id}
                >
                  {shippings
                    .find(
                      shipping =>
                        shipping.shipping_region_id === infos.shipping_id
                    )
                    .values.map(val => (
                      <MenuItem key={val.shipping_id} value={val.shipping_id}>
                        {val.shipping_type}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </div>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <div>
            <TextField
              error={infos.nameError}
              label="Name"
              value={infos.name}
              onChange={e =>
                setInfos({
                  ...infos,
                  nameError: false,
                  name: e.target.value
                })
              }
              margin="normal"
              variant="outlined"
            />
            <div>
              <label>
                Card details
                <CardElement
                  onBlur={() => {}}
                  onChange={() => {}}
                  onFocus={() => {}}
                  onReady={() => {}}
                  style={{
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                      color: "#aab7c4"
                    },
                    padding: 5
                  }}
                />
              </label>
            </div>
          </div>
        ) : null}

        {activeStep === 3 ? (
          <div>
            <div>Step 4</div>
          </div>
        ) : null}

        <hr />
        {activeStep < 4 && carts.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              disabled={disabledNext}
              variant="contained"
              color="primary"
              onClick={() => handleNext()}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default connect(
  store => ({ store }),
  dispatch => ({
    dispatch: (type, payload = null) => dispatch({ type, payload })
  })
)(Cart);
