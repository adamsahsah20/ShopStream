import React, { useState } from "react";
import { registeredUsers } from "./Register";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../RTK/slices/authSlice";

export default function Login() {
  let [checkEmail, setCheckEmail] = useState("");
  let [checkPassword, setCheckPassword] = useState("");
  let [error, setError] = useState();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    let found = registeredUsers.find(
      (u) => (u.email == checkEmail || u.username == checkEmail) && u.password == checkPassword
    );
    if (found) {
      dispatch(login({ user: found, token: "registerd-user" }));
      navigate("/");
      return;
    }
    try {
      let match = await axios.get("https://dummyjson.com/users/filter", {
        params: { key: "email", value: checkEmail },
      });
      let username = match.data.users.length > 0 ? match.data.users[0].username : checkEmail;
      let res = await axios.post("https://dummyjson.com/auth/login", {
        username: username,
        password: checkPassword,
        expiresInMins: 1440,
      });
      dispatch(login({ user: res.data, token: res.data.accessToken }));
      navigate("/");
      return;
    } catch (err) {
      setError("Incorrect email or password");
    }
  }

  return (
    <div className="d-flex justify-content-center py-5">
      <form
        onSubmit={handleSubmit}
        style={{ width: "440px" }}
        className="border rounded-2 shadow-sm p-4 d-flex flex-column gap-3">
        <h3 className="fw-bold text-center">Welcome back</h3>
        <p className="text-secondary text-center">
          Please enter your details to sign in.
        </p>

        <div>
          <label className="fw-bold" id="email">Email or Username</label>
          <input
            type="text"
            id="email"
            className="form-control"
            placeholder="adam@email.com or emilys"
            value={checkEmail}
            onChange={(e) => setCheckEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold" id="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <label className="d-flex gap-2">
          <input type="checkbox" /> Stay signed in for 30 days
        </label>

        <Button type="submit" variant="primary" className="fw-bold">
          Sign In →
        </Button>

        <p className="text-center">
          Do not have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}