var express = require("express");
var router = express.Router();
import { checkBody } from "../modules/checkBody";
const bcrypt = require("bcrypt")


router.post("/signup", (req, res) => {
    if (!checkBody(req.body, ['username', 'password', 'firstname'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    User.findOne({ username: req.body.username }).then(data => {
        if (data === null) {
            const hash = bcrypt.hashSync(req.body.password, 10);
            const newUser = new User({
                firstname: req.body.firstname,
                username: req.body.username,
                password: hash,

            });

            newUser.save().then(newDoc => {
                res.json({ result: true, token: newDoc.token });
            });
        } else {
            // User already exists in database
            res.json({ result: false, error: 'User already exists' });
        }
    });
});

// Route SignIn (connexion)
router.post("/signin", (req, res) => {
  //Vérification des champs
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //Cherche dans la DB en filtrant sur le username
  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

module.exports = router;
