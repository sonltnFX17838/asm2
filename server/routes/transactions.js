const express = require("express");

const router = express.Router();

const isAuth = require("../middlewares/is-auth");
const transactionsController = require("../controllers/transactions");

router.post(
  "/post-transactions",
  isAuth.isAuth,
  transactionsController.postTrans
);

router.get("/get-transactions", isAuth.isAuth, transactionsController.getTrans);

module.exports = router;
