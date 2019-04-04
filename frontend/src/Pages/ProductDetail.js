import React, { useContext, useEffect } from "react";
import ShopContext from "../Context/ShopContext";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Loading } from "../Components";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import BuyProduct from "../Components/Product/BuyProduct";

const styles = theme => ({
  root: {
    padding: 15,
    marginTop: 15
  }
});

function ProductDetail(props) {
  const { classes } = props;

  const shop = useContext(ShopContext);
  const { getProduct } = shop;
  const product = getProduct(parseInt(props.match.params.id, 0));
  const {
    product_id,
    name,
    url,
    isLoading,
    image,
    attributes,
    price,
    price_before_discount,
    description
  } = product;
  useEffect(() => {
    if (name) {
      document.title = name + " | TshirtShop";
    }
  }, [name]);

  if (isLoading) return <Loading />;
  if (!isLoading && !product_id) return <Redirect to="/" />;
  if (!isLoading && props.match.url !== url) return <Redirect to={url} />;
  return (
    <div className={classes.root}>
      <Grid container spacing={16} className="justify-xs-center">
        <Grid item xs={12} md={4}>
          <Grid container direction="row" justify="center" alignItems="center">
            <img alt={name} src={image} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography color="textPrimary" variant="h3" component="h1">
            {name}
          </Typography>
          <Typography variant="body1">{description}</Typography>

          {price_before_discount * 1 > 0 ? (
            <Typography
              color="textPrimary"
              variant="h6"
              component="b"
              style={{ textDecoration: "line-through" }}
            >
              ${price_before_discount}
            </Typography>
          ) : null}

          <Typography color="secondary" variant="h5" component="b">
            ${price}
          </Typography>
          {attributes.map(({ name, attribute_id, values }) => (
            <div key={attribute_id} style={{ marginTop: 15 }}>
              <Typography color="textPrimary" variant="h5" component="h2">
                {name} :
              </Typography>
              <Grid
                container
                spacing={8}
                direction="row"
                justify="flex-start"
                alignItems="center"
              >
                {values.map(({ value, attribute_value_id }) => (
                  <Grid item key={attribute_value_id}>
                    <Chip
                      className="product-chip"
                      style={{
                        borderColor: name === "Color" ? value : "#999"
                      }}
                      label={value}
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          ))}
          <br />
          <div>
            <BuyProduct product={product} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(ProductDetail);
