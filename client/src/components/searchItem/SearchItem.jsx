import "./searchItem.css";

const SearchItem = ({ data }) => {
  return (
    <div className="searchItem">
      <img src={data.photos[1]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{data.name}</h1>
        <span className="siDistance">{data.distance}m from center</span>
        {/* <span className="siTaxiOp">{data.tag}</span> */}
        <span className="siSubtitle">{data.desc}</span>
        <span className="siFeatures">{data.type}</span>
        {/* If can cancel */}
        {/* {data.free_cancel ? (
          <div>
            <span className="siCancelOp">Free cancellation </span>
            <span className="siCancelOpSubtitle">
              You can cancel later, so lock in this great price today!
            </span>
          </div>
        ) : (
          <div></div>
        )} */}
      </div>
      <div className="siDetails">
        <div className="siRating">
          {/* <span>{data.rate_text}</span>
          <button>{data.rate}</button> */}
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${data.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton">See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
