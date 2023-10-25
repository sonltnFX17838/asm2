const express = require("express");

const router = express.Router();

const hotelController = require("../controllers/hotels");

router.get("/hotel", hotelController.getHotelList);

router.get("/hotels/:id", hotelController.getDataHotel);

router.post("/rooms/:id", hotelController.postDataRoom);

router.post("/search", hotelController.postSearchHotel);

module.exports = router;
