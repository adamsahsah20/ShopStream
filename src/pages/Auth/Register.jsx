import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { Button } from "react-bootstrap";

export let registeredUsers = JSON.parse(localStorage.getItem("users")) || [];

export default function Register() {
  let [name, setName] = useState("");
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [error, setError] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    if (password && password.length < 8) {
      setError("Password must be at least 8 characters");
    } else if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  async function handleSubmit(e) {
    e.preventDefault();
    let found = registeredUsers.find((u) => u.email == email || u.username == username);
    if (error || !name || !username || !email || !password) return;
    if (password !== confirmPassword) return;
    await axios.post("https://dummyjson.com/users/add", {
      firstName: name,
      username,
      email,
      password,
    });

    if (found) {
      setError("email or username is already registerd");
    } else {
      registeredUsers.push({ name, username, email, password });
      localStorage.setItem("users", JSON.stringify(registeredUsers));
      Swal.fire({
        title: "Registered!",
        text: "Your account has been created.",
        icon: "success",
      }).then(() => {
        navigate("/login");
      });
    }
  }

  return (
    <div className="d-flex justify-content-center py-5">
      <form
        onSubmit={handleSubmit}
        style={{ width: "440px" }}
        className="border rounded-2 shadow-sm p-4 d-flex flex-column gap-3">
        <h3 className="fw-bold text-center">Create Account</h3>
        <p className="text-secondary text-center">
          Join ShopStream for a personalized shopping experience.
        </p>

        <div>
          <label className="fw-bold">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Adam Islam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="adam123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="adam@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="fw-bold">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <label className="d-flex gap-2">
          <input type="checkbox" required />I agree to the Terms of Service and
          Privacy Policy
        </label>

        <Button type="submit" variant="primary" className="fw-bold">
          Sign Up →
        </Button>

        <p className="text-center">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}