import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router";
import { Col, Row } from "react-bootstrap";

export default function Dashboard() {
  let user = useSelector((state) => state.auth.user);
  let token = useSelector((state) => state.auth.token);
  let [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
  async function checkAdmin() {
    try {
      let config = { headers: { Authorization: "Bearer " + token } };
      let res = await axios.get("https://dummyjson.com/auth/me", config);
      setIsAdmin(res.data.role == "admin");
    } catch {
      setIsAdmin(false);
    }
  }
  if (user && user.id) {
    checkAdmin();
  } else if (user && user.role == "admin") {
    setIsAdmin(true);
  }
}, [user]);

  return (
    <div>
      {isAdmin ? (
        <Row className="g-0 min-vh-100">
          <Col md={3} lg={2} className="bg-primary-subtle p-3 d-flex flex-column gap-2">
            <h4 className="fw-bold text-primary mb-0">ShopStream</h4>
            <p className="small text-secondary mb-3">Admin Panel</p>
            <NavLink
              to="/dashboard/products"
              className={({ isActive }) =>
                isActive
                  ? "p-2 rounded-2 text-decoration-none bg-primary text-white"
                  : "p-2 rounded-2 text-decoration-none text-dark"
              }
            >
              📦 Inventory
            </NavLink>
            <NavLink
              to="/dashboard/carts"
              className={({ isActive }) =>
                isActive
                  ? "p-2 rounded-2 text-decoration-none bg-primary text-white"
                  : "p-2 rounded-2 text-decoration-none text-dark"
              }
            >
              🛍️ Orders
            </NavLink>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive
                  ? "p-2 rounded-2 text-decoration-none bg-primary text-white"
                  : "p-2 rounded-2 text-decoration-none text-dark"
              }
            >
              👥 Customers
            </NavLink>
            <div className="mt-auto bg-white rounded-2 p-2">
              <p className="fw-bold small mb-0">{user.firstName || user.username}</p>
              <p className="text-secondary small mb-0">Admin</p>
            </div>
          </Col>
          <Col md={9} lg={10} className="p-4">
            <Outlet />
          </Col>
        </Row>
      ) : (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 py-5">
          <h2 className="fw-bold text-danger">Admins only</h2>
          <Link to="/">Go Home</Link>
        </div>
      )}
    </div>
  );
}