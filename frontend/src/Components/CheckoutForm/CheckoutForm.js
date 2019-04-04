import React, { useContext, useState } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import ShopContext from "../../Context/ShopContext";
import api from "../../Context/Api";
import TextField from "@material-ui/core/TextField";

export default injectStripe(props => {
  const { carts } = useContext(ShopContext);
  const [infos, setInfos] = useState({ name: "", nameError: false });
  const submit = async ev => {
    if (!infos.name) {
      setInfos({ ...infos, nameError: true });
      return;
    }
    let products = carts.map(({ product_id, qte }) => ({ product_id, qte }));
    let { token } = await props.stripe.createToken({ name: infos.name });
    if (!token || !token.id) return;
    let rep = await new api().paiement({
      token: token.id,
      products,
      shipping_id: props.shipping
    });
    console.log(rep);
  };

  return (
    <div>
      <TextField
        error={infos.nameError}
        label="Name"
        value={infos.name}
        onChange={e => setInfos({ nameError: false, name: e.target.value })}
        margin="normal"
        variant="outlined"
      />
      <CardElement />
      <button onClick={submit}>Send</button>
    </div>
  );
});
