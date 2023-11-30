import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "../enviroments";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    // Get user status
    this.app.route("/isSignedIn/")
      .get((req: express.Request, res: express.Response) => {
        const user = firebase.auth().currentUser;

        if (user == null)
          res.status(200).send(false)
        else
          res.status(200).send(true);
      });

    // Delete account
    this.app.route("/delete/")
      .delete((req:express.Request, res: express.Response) => {
        const user = firebase.auth().currentUser;

        if (user) {
          user.delete().then(() => {
            res.status(200).send("User deleted");
          }).catch((error) => {
            res.status(500).send(error);
          });
        } else {
          res.status(409).send("The user couldn't be found")
        }
      })

    // Sign out
    this.app.route("/logout/")
      .get((req: express.Request, res: express.Response) => {
        firebase.auth().signOut().then(() => {
          res.status(200).send("Sign-out successful");
        }).catch((error) => {
          res.status(500).send(error);
        });
      });

    // Sign in with email and password
    this.app.route("/login/:email/:password")
      .get((req: express.Request, res: express.Response) => {
        let email = req.params.email;
        let password = req.params.password;

        firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            res.status(201).send(user);
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      });

    // Create user with email and password
    this.app.route("/register/:email/:password")
      .post((req: express.Request, res: express.Response) => {
        let email = req.params.email;
        let password = req.params.password;

        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            res.status(201).send(user);
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      });

    return this.app;
  }
}
