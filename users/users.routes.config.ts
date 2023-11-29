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
