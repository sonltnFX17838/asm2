import React from "react";
import { useNavigate } from "react-router-dom";

import "./featuredProperties.css";

const FeaturedProperties = ({ dataHotels }) => {
  const navigate = useNavigate();

  const handleGetHotel = (idHotel) => {
    navigate(`/hotels/${idHotel}`);
  };

  const featuredHotels = dataHotels
    .filter((hotel) => hotel.featured === "true")
    .slice(0, 3);

  return (
    <div className="fp">
      {featuredHotels.map((hotel) => {
        return (
          <div className="fpItem" key={hotel._id}>
            <img
              src={hotel.photos[2]}
              alt=""
              className="fpImg"
              onClick={() => handleGetHotel(hotel._id)}
            />
            <span className="fpName">
              <a target="_blank" onClick={() => handleGetHotel(hotel._id)}>
                {hotel.name}
              </a>
            </span>
            <span className="fpCity">{hotel.city}</span>
            <span className="fpPrice">
              Starting from ${hotel.cheapestPrice}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProperties;
