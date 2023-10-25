import React, { useEffect, useState } from "react";
import axios from "axios";

import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";

const Home = () => {
  const [dataHotels, setDataHotels] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/hotel")
      .then((response) => {
        setDataHotels(response.data.dataHotels);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <Header />
      {dataHotels && (
        <div className="homeContainer">
          <Featured dataHotels={dataHotels} />
          <h1 className="homeTitle">Browse by property type</h1>
          <PropertyList dataHotels={dataHotels} />
          <h1 className="homeTitle">Homes guests love</h1>
          <FeaturedProperties dataHotels={dataHotels} />
          <MailList />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Home;
