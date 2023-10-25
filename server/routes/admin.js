const express = require("express");

const router = express.Router();

const isAdmin = require("../middlewares/is-admin");
const adminControllers = require("../controllers/admin");

router.post("/login", adminControllers.postLoginAdmin);

router.post("/dashboard", isAdmin.isAdmin, adminControllers.postDash);

router.get("/transactions", isAdmin.isAdmin, adminControllers.getTrans);

router.post("/hotels", isAdmin.isAdmin, adminControllers.postHotels);

router.delete("/del-hotel/:id", isAdmin.isAdmin, adminControllers.deleteHotel);

router.post("/rooms", isAdmin.isAdmin, adminControllers.postRooms);

router.delete("/del-room/:id", isAdmin.isAdmin, adminControllers.deleteRoom);

router.post("/users", isAdmin.isAdmin, adminControllers.postUsers);

router.get("/edit-room/:id", isAdmin.isAdmin, adminControllers.getEditRoom);

router.post("/edit-room/:id", isAdmin.isAdmin, adminControllers.postEditRoom);

router.get("/edit-hotel/:id", isAdmin.isAdmin, adminControllers.getEditHotel);

router.post("/edit-hotel/:id", isAdmin.isAdmin, adminControllers.postEditHotel);

module.exports = router;
