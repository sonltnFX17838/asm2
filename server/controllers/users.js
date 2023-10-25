const User = require("../models/users");
const bcrypt = require("bcrypt");

exports.postCreateUser = (req, res, next) => {
  const { username, password, fullName, phoneNumber, email } = req.body.data;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            username: username,
            password: hashedPassword,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
          });
          user
            .save()
            .then((user) => {
              res.send({ success: true });
            })
            .catch((err) => console.log(err));
        });
      } else {
        res.json({ message: "Account already in use!" });
      }
    })
    .catch((err) => console.log(err));
};

exports.postLoginUser = (req, res, next) => {
  const { username, password } = req.body.data;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "can't find user or wrong password!" });
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          return res.status(200).json(req.sessionID);
        } else {
          return res.status(400).send("Invalid email or password");
        }
      });
    })
    .catch((err) => console.log(err));
};

exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    return res.status(200).json({ username: req.user.username });
  } else {
    return res.status(200).json({ username: false });
  }
};

exports.postLogoutUser = (req, res, next) => {
  const session = req.headers.authorization;
  req.store.destroy(session, (err) => {
    if (err) {
      console.error(err);
      res.status(401).json({ message: "error with server" });
    } else {
      console.log("Session deleted successfully!");
      res.json({ success: true });
    }
  });
};
