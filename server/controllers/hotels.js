const Hotel = require("../models/hotels");

const Transaction = require("../models/transactions");

exports.getHotelList = (req, res, next) => {
  Hotel.find()
    .then((result) => {
      res.send({ dataHotels: result });
    })
    .catch((err) => console.log(err));
};

exports.getDataHotel = (req, res, next) => {
  const id = req.params.id;

  Hotel.findById(id)
    .then((hotel) => {
      res.send({ hotelData: hotel });
    })
    .catch((err) => console.log(err));
};

exports.postSearchHotel = (req, res, next) => {
  const city = req.body.city;
  const room = req.body.room;
  const adult = req.body.adult;
  const searchObj =
    city !== ""
      ? { city: city, $expr: { $gte: [{ $size: "$rooms" }, room] } }
      : { $expr: { $gte: [{ $size: "$rooms" }, room] } };

  Hotel.find(searchObj)
    .then((hotels) => {
      const promises = hotels.map((hotel) => {
        return Hotel.findById(hotel._id).populate("rooms").exec();
      });
      return Promise.all(promises);
    })
    .then((populatedHotels) => {
      const newHotels = populatedHotels.filter((hotel) => {
        let totalPeople = 0;
        for (let i = 0; i < hotel.rooms.length; i++) {
          totalPeople +=
            hotel.rooms[i].roomNumbers.length * hotel.rooms[i].maxPeople;
        }
        return totalPeople >= adult;
      });
      res.send({ hotels: newHotels });
    })
    .catch((err) => console.log(err));
};

exports.postDataRoom = (req, res, next) => {
  const id = req.params.id;
  const { endDate, startDate } = req.body.date;
  const coverDay = (dt) => {
    const date = new Date(dt);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  const sBooking = coverDay(startDate);
  const eBooking = coverDay(endDate);

  const roomBookedPromise = Transaction.find({ hotel: id })
    .then((trans) => {
      return trans.filter((tran) => {
        const sBooked = coverDay(tran.dateStart);
        const eBooked = coverDay(tran.dateEnd);
        return (
          (sBooked >= sBooking && eBooked <= eBooking) ||
          (sBooking <= eBooked && sBooking >= sBooked)
        );
      });
    })
    .then((trans) => {
      return trans.map((tran) => tran.room);
    })
    .catch((err) => console.log(err));

  const roomHotelPromise = Hotel.findById(id)
    .populate("rooms")
    .exec()
    .then((hotel) => {
      return hotel.rooms;
    })
    .catch((err) => {
      console.log(err);
    });

  Promise.all([roomBookedPromise, roomHotelPromise])
    .then(([roomBooked, roomHotel]) => {
      roomHotel.forEach((room) => {
        for (let i = room.roomNumbers.length - 1; i >= 0; i--) {
          if (
            roomBooked.length > 0 &&
            roomBooked[0].includes(room.roomNumbers[i])
          ) {
            room.roomNumbers.splice(i, 1);
          }
        }
      });
      return roomHotel;
    })
    .then((roomData) => {
      res.json({ rooms: roomData });
    })
    .catch((err) => console.log(err));
};
