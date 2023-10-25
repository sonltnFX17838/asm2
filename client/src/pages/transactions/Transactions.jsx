import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./transactions.css";

const Transactions = () => {
  const navigate = useNavigate();
  const [dataTrans, setDataTrans] = useState([]);
  const session = localStorage.getItem("session");

  useEffect(() => {
    if (session) {
      axios
        .get("http://localhost:5000/get-transactions", {
          headers: { Authorization: session },
        })
        .then((response) => {
          setDataTrans(response.data.data);
        });
    } else {
      navigate("/login");
    }
  }, []);

  const coverDate = (dt) => {
    const date = new Date(dt);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  return (
    <div className="trans-tab">
      <h2>Your Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Hotel</th>
            <th>Rooms</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataTrans.map((data, index) => (
            <tr key={index}>
              <td># {index}</td>
              <td>{data.hotel.name}</td>
              <td>
                {data.room.map((room) => (
                  <p key={room}>{room}</p>
                ))}
              </td>
              <td>
                {coverDate(data.dateStart)} - {coverDate(data.dateEnd)}
              </td>
              <td>$ {data.price}</td>
              <td>{data.payment}</td>
              <td>
                <p className={`status ${data.status}`}>{data.status}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
