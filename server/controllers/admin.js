const Hotel = require("../models/hotels");
const Room = require("../models/room");
const Transaction = require("../models/transactions");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const pages = (data, pageNumb) => {
  const pageSize = 8;
  const startIndex = (pageNumb - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const newData = data.slice(startIndex, endIndex);
  const totalPage = Math.ceil(data.length / pageSize);
  return { data: newData, totalPage: totalPage };
};

const dateNow = new Date();

exports.postLoginAdmin = (req, res, next) => {
  const { username, password } = req.body.data;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Can't find user or wrong password!" });
      }
      if (user.isAdmin === false) {
        console.log("test");
        return res.json({ message: "You are not an admin!" });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            return res.status(200).json(req.sessionID);
          } else if (!doMatch) {
            return res
              .status(401)
              .json({ message: "Can't find user or wrong password!" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Server error!" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error!" });
    });
};

exports.postDash = (req, res, next) => {
  const pageNumb = req.body.pageNumb;
  Transaction.find()
    .populate([
      { path: "hotel", select: "name" },
      { path: "user", select: "username" },
    ])
    .then(async (trans) => {
      const usersPromise = User.countDocuments({ isAdmin: false })
        .then((result) => result)
        .catch((err) => console.log(err));
      let earnings = 0;
      trans.forEach((tran) => (earnings += tran.price));
      const { data, totalPage } = pages(trans, pageNumb);

      const [users] = await Promise.all([usersPromise]);

      return {
        data: data,
        totalPage: totalPage,
        information: {
          users: users,
          orders: trans.length,
          earnings: earnings,
          balance: earnings / trans.length,
        },
      };
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
};

exports.getTrans = (req, res, next) => {
  const now = new Date();
  Transaction.find()
    .populate([
      { path: "hotel", select: "name" },
      { path: "user", select: "username" },
    ])
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
      res.json({ data: trans });
    })
    .catch((err) => console.log(err));
};

exports.postHotels = (req, res, next) => {
  const pageNumb = req.body.pageNumb;
  Hotel.find()
    .then((hotels) => {
      const { data, totalPage } = pages(hotels, pageNumb);
      res.json({ data: data, totalPage: totalPage });
    })
    .catch((err) => console.log(err));
};

exports.deleteHotel = (req, res, next) => {
  const idHotel = req.params.id;
  Transaction.find({ hotel: idHotel })
    .populate("hotel")
    .then((trans) => {
      trans.forEach((tran) => {
        if (tran.status !== "Checkout") {
          return res.json({ message: "Customer are staying" });
        }
      });
      Hotel.findByIdAndDelete(idHotel)
        .then(() => {
          res.json({ success: true });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error deleting");
        });
    });
};

exports.postRooms = (req, res, next) => {
  const pageNumb = req.body.pageNumb;
  Room.find()
    .then((hotels) => {
      const { data, totalPage } = pages(hotels, pageNumb);
      res.json({ data: data, totalPage: totalPage });
    })
    .catch((err) => console.log(err));
};

exports.deleteRoom = async (req, res, next) => {
  const idRoom = req.params.id;
  const roomNumb = await Room.findById(idRoom)
    .then((result) => result.roomNumbers)
    .catch((err) => console.log(err));
  const idHotels = await Hotel.find()
    .then((hotels) => {
      const id = [];
      hotels.forEach((hotel) => {
        for (let i = 0; i < hotel.rooms.length; i++) {
          if (hotel.rooms[i].toString() === idRoom) {
            id.push(hotel._id.toString());
          }
        }
      });
      return id;
    })
    .catch((err) => console.log(err));

  Transaction.find({ hotel: { $in: idHotels } })
    .then((trans) => {
      let isStay = false;
      trans.forEach((tran) => {
        if (
          tran.dateEnd.getTime() >= dateNow.getTime() &&
          tran.dateStart.getTime() >= dateNow.getTime()
        ) {
          roomNumb.forEach((room) => {
            for (let i = 0; i < trans.room.length; i++) {
              if (trans.room[i].includes(room)) {
                isStay = true;
              }
            }
          });
        }
      });
      return isStay;
    })
    .then((isStay) => {
      if (isStay) {
        return res.json({ message: "Customer are staying" });
      }
      Room.findByIdAndDelete(idRoom)
        .then(() => {
          res.json({ success: true });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error deleting");
        });
    })
    .catch((err) => console.log(err));
};

exports.postUsers = (req, res, next) => {
  const pageNumb = req.body.pageNumb;
  User.find({ isAdmin: false })
    .then((hotels) => {
      const { data, totalPage } = pages(hotels, pageNumb);
      res.json({ data: data, totalPage: totalPage });
    })
    .catch((err) => console.log(err));
};

exports.getEditRoom = (req, res, next) => {
  Hotel.find()
    .then((result) => res.json({ hotels: result }))
    .catch((err) => console.log(err));
};

exports.getEditHotel = (req, res, next) => {
  Room.find()
    .then((result) => res.json({ rooms: result }))
    .catch((err) => console.log(err));
};

exports.postEditHotel = async (req, res, next) => {
  const idHotel = req.params.id;
  const {
    name,
    type,
    city,
    address,
    distance,
    photos,
    desc,
    rating,
    featured,
    rooms,
    title,
    cheapestPrice,
  } = req.body.data;
  try {
    if (idHotel === "new-hotel") {
      const newHotel = new Hotel({
        name: name,
        type: type,
        city: city,
        address: address,
        distance: distance,
        photos: photos,
        desc: desc,
        rating: rating,
        featured: featured,
        rooms: rooms,
        title: title,
        cheapestPrice: cheapestPrice,
      });
      newHotel.save();
      return res.json({ success: true });
    }

    const updateHotel = await Hotel.findById(idHotel);
    updateHotel.name = name;
    updateHotel.type = type;
    updateHotel.city = city;
    updateHotel.address = address;
    updateHotel.distance = distance;
    updateHotel.photos = photos;
    updateHotel.desc = desc;
    updateHotel.rating = rating;
    updateHotel.featured = featured;
    updateHotel.rooms = rooms;
    updateHotel.title = title;
    updateHotel.cheapestPrice = cheapestPrice;

    updateHotel.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditRoom = async (req, res, next) => {
  const idRoom = req.params.id;
  const idHotel = req.body.hotel;
  const { title, price, maxPeople, desc, roomNumbers } = req.body.data;
  try {
    if (idRoom === "new-room") {
      const hotel = await Hotel.findById(idHotel).populate("rooms");
      const roomsOfHotel = hotel.rooms;
      roomsOfHotel.forEach((room) =>
        room.roomNumbers.forEach((numb) => {
          if (roomNumbers.includes(numb)) {
            return res.json({ message: "This room already exists" });
          }
        })
      );
      const newRoom = new Room({
        title: title,
        price: price,
        desc: desc,
        maxPeople: maxPeople,
        roomNumbers: roomNumbers,
      });
      newRoom.save();
      hotel.rooms.push(newRoom);
      hotel.save();
      return res.json({ success: true });
    }

    const hotels = await Hotel.find();
    const hotelsChange = hotels.filter((hotel) => {
      return hotel.rooms.some((room) => room.equals(idRoom));
    });

    const checked = false;
    hotelsChange.forEach((hotel) => {
      hotel.rooms.forEach((room) => {
        for (let i = 0; i < room.roomNumbers.length; i++) {
          if (
            roomNumbers.includes(room.roomNumbers[i]) &&
            !room.equals(idRoom)
          ) {
            checked = room.roomNumbers[i];
          }
        }
      });
    });

    if (checked) {
      return res.json({ message: `This room ${checked} already exists` });
    }

    const updateRoom = await Room.findById(idRoom);
    updateRoom.title = title;
    updateRoom.price = price;
    updateRoom.maxPeople = maxPeople;
    updateRoom.desc = desc;
    updateRoom.roomNumbers = roomNumbers;

    updateRoom.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
