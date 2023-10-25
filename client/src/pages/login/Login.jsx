import React, { useReducer } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./login.css";

const initialState = {
  username: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  email: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER_NAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_PHONE_NUMBER":
      return { ...state, phoneNumber: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Login = () => {
  const { login } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/sign-up", {
        data: state,
      })
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { data: state })
      .then((response) => {
        const data = response.data;
        if (data.message) {
          alert(data.message);
        } else {
          localStorage.setItem("session", data);
          navigate("/");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  let content = <hr></hr>;
  if (login === "login") {
    content = (
      <form className="log-in-page" onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="User Name"
          onChange={(e) =>
            dispatch({
              type: "SET_USER_NAME",
              payload: e.target.value,
            })
          }
          value={state.username}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            dispatch({
              type: "SET_PASSWORD",
              payload: e.target.value,
            })
          }
          value={state.password}
        />
        <button>Login</button>
      </form>
    );
  } else if (login === "sign-up") {
    content = (
      <form className="log-in-page" onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="User Name"
          onChange={(e) =>
            dispatch({
              type: "SET_USER_NAME",
              payload: e.target.value,
            })
          }
          value={state.username}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            dispatch({
              type: "SET_PASSWORD",
              payload: e.target.value,
            })
          }
          value={state.password}
        />
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) =>
            dispatch({
              type: "SET_FULL_NAME",
              payload: e.target.value,
            })
          }
          value={state.fullName}
        />
        <input
          type="text"
          placeholder="Phone Number"
          onChange={(e) =>
            dispatch({
              type: "SET_PHONE_NUMBER",
              payload: e.target.value,
            })
          }
          value={state.phoneNumber}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) =>
            dispatch({
              type: "SET_EMAIL",
              payload: e.target.value,
            })
          }
          value={state.email}
        />
        <button>Sign Up</button>
      </form>
    );
  }

  return <div>{content}</div>;
};

export default Login;
