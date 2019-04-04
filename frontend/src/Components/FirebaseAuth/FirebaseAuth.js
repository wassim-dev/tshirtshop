import React, { useState, useContext, useEffect } from "react";
import firebase from "@firebase/app";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShopContext from "../../Context/ShopContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogActions from "@material-ui/core/DialogActions";
import "firebase/auth";
import "./FirebaseAuth.css";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer
} from "@react-firebase/auth";

import GoogleIcon from "./GoogleIcon";
import FacebookIcon from "./FacebookIcon";
import { IconButton, Typography } from "@material-ui/core";
import config from "../../config";




export default function FirebaseAuth(props) {
  const {
    user,
    setUser,
    setStateLoginDialog,
    openLoginDialogState
  } = useContext(ShopContext);
  const [firebaseUser, setFirebaseUser] = useState(null);
  useEffect(() => {
    if (firebaseUser) {
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          if (firebaseUser) {
            firebaseUser.idToken = idToken;
          }
          setUser(firebaseUser);
        })
        .catch(function (error) {
          console.log("idToken error", error);
        });
    }
  }, [firebaseUser]);
  const handleLogout = () => {
    firebase.auth().signOut();
    setTimeout(() => {
      localStorage.removeItem("sessionid");
      setFirebaseUser(null);
      setUser(null);
    }, 10);
  };
  const loginWithFacebook = () => {
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebookAuthProvider);
    setStateLoginDialog(false);
  };
  const loginWithGoogle = () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider);
    setStateLoginDialog(false);
  };
  return (
    <>
      <FirebaseAuthProvider {...config.FIREBASE} firebase={firebase}>
        {user ? (
          <div className="user-infos">
            <div className="user-actions">
              <span className="user-name">{user.displayName}</span>
              <Button
                size="small"
                className="user-logout"
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
            </div>
            <Avatar
              className="user-avatar"
              style={{ cursor: "pointer" }}
              src={user.photoURL}
            />
          </div>
        ) : (
            <IconButton onClick={() => setStateLoginDialog(true)}>
              <Typography variant="button">Login</Typography>
            </IconButton>
          )}
        <FirebaseAuthConsumer>
          {userInfo => {
            if (userInfo.user) {
              setFirebaseUser(userInfo.user);
            }
          }}
        </FirebaseAuthConsumer>
      </FirebaseAuthProvider>
      <Dialog aria-labelledby="simple-dialog-title" open={openLoginDialogState}>
        <DialogTitle id="simple-dialog-title">Login</DialogTitle>
        <List>
          <ListItem button onClick={() => loginWithFacebook()}>
            <ListItemAvatar>
              <FacebookIcon />
            </ListItemAvatar>
            <ListItemText primary="Login With Facebook" />
          </ListItem>
          <ListItem button onClick={() => loginWithGoogle()}>
            <ListItemAvatar>
              <GoogleIcon />
            </ListItemAvatar>
            <ListItemText primary="Login With Google" />
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setStateLoginDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
