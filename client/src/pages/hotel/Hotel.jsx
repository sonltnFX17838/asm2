import { useParams } from "react-router-dom";

import "./hotel.css";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

import Booking from "../booking/Booking";

const Hotel = () => {
  const { id } = useParams();
  const [goBooking, setGoBooking] = useState(false);

  const [dataHotel, setDataHotel] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/hotels/${id}`)
      .then((response) => {
        setDataHotel(response.data.hotelData);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? dataHotel.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === dataHotel.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  return (
    <div>
      <Header type="list" />
      {dataHotel && (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={dataHotel.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookNow" onClick={() => setGoBooking(true)}>
              Reserve or Book Now!
            </button>
            <h1 className="hotelTitle">{dataHotel.title}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{dataHotel.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent location – {dataHotel.distance}m from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over ${dataHotel.cheapestPrice} at this property and
              get a free airport taxi
            </span>
            <div className="hotelImages">
              {dataHotel.photos.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{dataHotel.title}</h1>
                <p className="hotelDesc">{dataHotel.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                {/* <h1>Perfect for a 9-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span> */}
                <h2>
                  <b>${dataHotel.cheapestPrice}</b> (1 nights)
                </h2>
                <button onClick={() => setGoBooking(true)}>
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>
          {goBooking && <Booking id={dataHotel._id} />}
          <MailList />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Hotel;
