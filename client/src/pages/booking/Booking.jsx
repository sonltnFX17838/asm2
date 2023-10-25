import React, { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { DateRange } from "react-date-range";

import "./booking.css";
import axios from "axios";

const initialState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateStart: "",
  dateEnd: "",
  hotel: "",
  rooms: [],
  price: 0,
  payment: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PHONE_NUMBER":
      return { ...state, phoneNumber: action.payload };
    case "SET_DATE_START":
      return { ...state, dateStart: action.payload };
    case "SET_DATE_END":
      return { ...state, dateEnd: action.payload };
    case "SET_HOTEL":
      return { ...state, hotel: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_PAYMENT":
      return { ...state, payment: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Booking = ({ id }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dataRoom, setDataRom] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [roomPrice, setRoomPrice] = useState(0);
  const session = localStorage.getItem("session");

  useEffect(() => {
    dispatch({ type: "SET_HOTEL", payload: id });
    console.log(date[0].startDate);
    axios
      .post(`http://localhost:5000/rooms/${id}`, {
        date: date[0],
      })
      .then((response) => {
        setDataRom(response.data.rooms);
      })
      .catch((err) => console.log(err));
  }, [date]);

  useEffect(() => {
    const sumDate =
      Math.ceil(
        Math.abs(date[0].endDate - date[0].startDate) / (1000 * 60 * 60 * 24)
      ) + 1;
    dispatch({ type: "SET_PRICE", payload: sumDate * roomPrice });
  }, [date, roomPrice]);

  const setRoomsNumber = (e, numb, price) => {
    if (e.target.checked === true) {
      dispatch({ type: "SET_ROOMS", payload: [...state.rooms, numb] });
      setRoomPrice(roomPrice + price);
    } else {
      dispatch({
        type: "SET_ROOMS",
        payload: state.rooms.filter((r) => r !== numb),
      });
      setRoomPrice(roomPrice - price);
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_DATE_START", payload: date[0].startDate });
    dispatch({ type: "SET_DATE_END", payload: date[0].endDate });
  }, [date]);

  const postBookHotel = () => {
    if (state.fullName.length < 5) {
      return alert("Please write your full name");
    }
    if (!state.email.includes("@") || state.email.length < 5) {
      return alert("Email is wrong, please try again");
    }
    if (state.rooms.length < 1) {
      return alert("Please select room of hotel");
    }
    if (state.payment === "") {
      return alert("Please select payment.");
    }
    axios
      .post(
        "http://localhost:5000/post-transactions",
        {
          data: state,
        },
        { headers: { Authorization: session } }
      )
      .then((response) => {
        if (response.data.message) {
          return alert(response.data.message);
        }
        navigate("/transactions");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="booking">
      <div className="booking-form">
        <div className="date-booking">
          <h2>Dates</h2>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className="booking-date"
            minDate={new Date()}
          />
        </div>
        <div className="info-booking">
          <h2>Reserve Info</h2>
          <form>
            <div>
              <label>Your Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) =>
                  dispatch({ type: "SET_FULL_NAME", payload: e.target.value })
                }
              ></input>
            </div>
            <div>
              <label>Your Email</label>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
              ></input>
            </div>
            <div>
              <label>Your Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                onChange={(e) =>
                  dispatch({
                    type: "SET_PHONE_NUMBER",
                    payload: e.target.value,
                  })
                }
              ></input>
            </div>
            <div>
              <label>Your Identity Cart Number</label>
              <input type="text" placeholder="Cart Number"></input>
            </div>
          </form>
        </div>
      </div>
      <div>
        <h2>Select Room</h2>
        <div className="select-room">
          {dataRoom.length > 0 &&
            dataRoom.map((room) => (
              <div className="check-form" key={room._id}>
                <div>
                  <b>{room.title}</b>
                  <p>{room.desc}</p>
                  <p style={{ fontSize: "14px" }}>
                    Max people: {room.maxPeople}
                  </p>
                  <b>${room.price}</b>
                </div>
                <div className="check-room">
                  {room.roomNumbers.map((numb) => (
                    <label key={numb}>
                      <p>{numb}</p>
                      <input
                        type="checkbox"
                        onClick={(e) => setRoomsNumber(e, numb, room.price)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h2>Total Bill:${state.price}</h2>
        <div className="total-bill">
          <select
            onChange={(e) =>
              dispatch({ type: "SET_PAYMENT", payload: e.target.value })
            }
          >
            <option value="">Select Payment Method</option>
            <option value="Credit cart">Credit cart</option>
            <option value="Cash">Cash</option>
          </select>
          <button onClick={postBookHotel}>Reserve Now</button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
