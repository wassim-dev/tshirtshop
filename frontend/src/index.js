import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Reducer from "./Context/Reducer";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Header, Footer } from "./Layout";
import { Home, Department, Category, ProductDetail, NotFound } from "./Pages";
import "./styles.css";
import { connect } from "react-redux";
import { Loading } from "./Components";
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const App = connect(store => ({ store }))(function({ store }) {
  if (store.isLoading) return <Loading />;
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Header />
          <div className="container container-app">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/tshirt/:department" component={Department} />
              <Route
                exact
                path="/tshirt/:department/:category"
                component={Category}
              />

              <Route
                exact
                path="/tshirt-:slug-:id(\d+)"
                component={ProductDetail}
              />

              <Route path="*" component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Reducer>
    <App />
  </Reducer>,
  rootElement
);
