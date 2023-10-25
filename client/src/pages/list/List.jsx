import "./list.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import axios from "axios";

const List = () => {
  const [hotelData, setHotelData] = useState([]);
  const location = useLocation();
  const [destination, setDestination] = useState(
    location.state.destination.replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);

  const searchFnt = () => {
    axios
      .post("http://localhost:5000/search", {
        city: destination,
        room: options.room,
        adult: options.adult,
      })
      .then((response) => {
        setHotelData(response.data.hotels);
      })
      .catch((err) => console.log(err));
  };

  const setAdult = (value) => {
    setOptions({ ...options, adult: +value });
  };
  const setChilden = (value) => {
    setOptions({ ...options, childen: +value });
  };
  const setRoom = (value) => {
    setOptions({ ...options, room: +value });
  };

  useEffect(() => {
    searchFnt();
  }, []);

  return (
    <div>
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder={destination}
                type="text"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    onChange={(e) => setAdult(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) => setChilden(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button onClick={searchFnt}>Search</button>
          </div>
          <div className="listResult">
            {hotelData.map((data, index) => (
              <SearchItem data={data} key={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
