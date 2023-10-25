const Transactions = require("../models/transactions");
const User = require("../models/users");

exports.postTrans = (req, res, next) => {
  const {
    rooms,
    hotel,
    price,
    payment,
    dateStart,
    dateEnd,
    fullName,
    email,
    phoneNumber,
  } = req.body.data;
  console.log(req.body.data);

  User.findOne({
    fullName: fullName,
    email: email,
    phoneNumber: phoneNumber,
    _id: req.user._id,
  })
    .then((user) => {
      if (!user) {
        return res.json({ message: "Wrong infomation!" });
      }
      const transaction = new Transactions({
        user: user._id,
        room: rooms,
        hotel: hotel,
        price: price,
        payment: payment,
        dateStart: dateStart,
        dateEnd: dateEnd,
      });
      transaction
        .save()
        .then((result) => {
          res.json({ success: true });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getTrans = (req, res, next) => {
  const now = new Date();

  Transactions.find({ user: req.user._id })
    .populate({ path: "hotel", select: "name" })
    .then((transactions) => {
      transactions.forEach((transaction) => {
        if (transaction.dateEnd.getTime() < now.getTime()) {
          transaction.status = "Checkout";
          transaction.save();
        } else if (
          transaction.dateStart.getTime() >= now.getTime() &&
          transaction.dateEnd.getTime() <= now.getTime()
        ) {
          transaction.status = "Checkin";
          transaction.save();
        }
      });
      return transactions;
    })
    .then((trans) => {
      if (!trans) {
        return res.json({ data: [] });
      }
      res.json({ data: trans });
    })
    .catch((err) => console.log(err));
};
