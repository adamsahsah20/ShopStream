import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Button, Col, Row } from "react-bootstrap";
import { logout } from "../../RTK/slices/authSlice";

export default function Profile() {
  let user = useSelector((state) => state.auth.user);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [orders, setOrders] = useState([]);

  useEffect(() => {
  async function fetchOrders() {
  let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
  let myOrders = savedOrders.filter((o) => o.userEmail == user.email).reverse();
  if (user.id) {
    try {
      let res = await axios.get(`https://dummyjson.com/carts/user/${user.id}`);
      setOrders([...myOrders, ...res.data.carts]);
    } catch {
      setOrders(myOrders);
    }
  } else {
    setOrders(myOrders);
  }
}
    if (user) {
      fetchOrders();
    }
  }, [user]);

  let totalOrders = orders.length;
  let loyaltyPoints = totalOrders * 3;

  return (
    <div className="container">
      {user ? (
        <Row className="g-4">
          <Col lg={3}>
            <div className="border rounded-2 p-3 d-flex flex-column gap-2">
              <h6 className="fw-bold text-primary mb-0">Account</h6>
              <p className="text-secondary small mb-2">Manage your settings</p>
              <div className="bg-primary text-white rounded-2 p-2 fw-bold">👤 My Profile</div>
              <hr />
              <p
                className="text-danger fw-bold p-2 mb-0"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              >
                🚪 Sign Out
              </p>
            </div>
          </Col>

          <Col lg={9}>
            <div className="border rounded-2 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3 bg-primary-subtle">
              <div className="d-flex align-items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="avatar"
                    className="rounded-circle object-fit-cover"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center fs-1"
                    style={{ width: "100px", height: "100px" }}
                  >
                    👤
                  </div>
                )}
                <div>
                  <h2 className="fw-bold mb-0">
                    {user.firstName || user.name || user.username}
                  </h2>
                  <p className="text-secondary mb-2">{user.email}</p>
                </div>
              </div>
              <div className="d-flex flex-column gap-2">
                <Button variant="primary">Edit Profile</Button>
                <Button variant="outline-primary">View Analytics</Button>
              </div>
            </div>

            <Row className="g-3 mt-1">
              <Col md={6}>
                <div className="border rounded-2 p-3">
                  <p className="text-secondary small mb-1">📦 Total Orders</p>
                  <h3 className="fw-bold mb-0">{totalOrders}</h3>
                </div>
              </Col>
              <Col md={6}>
                <div className="border rounded-2 p-3">
                  <p className="text-secondary small mb-1">⭐ Loyalty Points</p>
                  <h3 className="fw-bold mb-0">{loyaltyPoints}</h3>
                </div>
              </Col>
            </Row>

            <div className="border rounded-2 mt-4">
              <div className="d-flex justify-content-between p-3 bg-primary-subtle">
                <h5 className="fw-bold mb-0">Recent Orders</h5>
              </div>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Product</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold">#SS-{o.id}</td>
                          <td>
  {o.products.map((p) => (
    <div key={p.id} className="d-flex align-items-center mb-2">
      <img
        src={p.thumbnail}
        alt={p.title}
        className="rounded-2 me-2"
        style={{ width: "40px", height: "40px" }}
      />
      <p>{p.title}</p>
    </div>
  ))}
</td>
                          <td>{o.totalQuantity}</td>
                          <td className="fw-bold text-primary">${o.total.toFixed(2)}</td>
                          <td>
                            <span className="badge rounded-pill bg-success-subtle text-success">
                              Delivered
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-secondary">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3">
          <h2 className="fw-bold text-danger">You are not logged in</h2>
          <Link to="/login"> Go To Login </Link>
        </div>
      )}
    </div>
  );
}