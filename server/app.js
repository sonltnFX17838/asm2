const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_DB;

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: "something",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const adminRoutes = require("./routes/admin");
const hotelsRoutes = require("./routes/hotels");
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");

app.use((req, res, next) => {
  req.store = store;
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/admin", adminRoutes);
app.use(hotelsRoutes);
app.use(transactionsRoutes);
app.use(usersRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
