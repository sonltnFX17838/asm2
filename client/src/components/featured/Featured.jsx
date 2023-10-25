import "./featured.css";

const Featured = ({ dataHotels }) => {
  const numbOfHotel = (area) => {
    return dataHotels.filter((hotel) => hotel.city === area).length;
  };
  return (
    <div className="featured">
      <div className="featuredItem">
        <img src="/images/Ha Noi.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
          <h1>Ha Noi</h1>
          <h2>{numbOfHotel("Ha Noi")} properties</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img src="/images/HCM.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
          <h1>Ho Chi Minh</h1>
          <h2>{numbOfHotel("Ho Chi Minh")} properties</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img src="/images/Da Nang.jpg" alt="" className="featuredImg" />
        <div className="featuredTitles">
          <h1>Da Nang</h1>
          <h2>{numbOfHotel("Da Nang")} properties</h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;
