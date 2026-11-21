import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { Button, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { clearCart } from "../../RTK/slices/cartSlice";

export default function Checkout() {
  let cartProducts = useSelector((state) => state.cart);
  let user=useSelector((state)=> state.auth.user)
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [address, setAddress] = useState("");
  let [city, setCity] = useState("");
  let [zip, setZip] = useState("");
  let [phone, setPhone] = useState("");
  let [error, setError] = useState("");

  let subtotal = cartProducts.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0);
  let tax = subtotal * 0.08;
  let total = subtotal + tax;

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !address || !city || !zip || !phone) {
      setError("Please fill in all fields");
      return;
    }
    let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    savedOrders.push({
  id: Date.now(),
  userEmail: user.email,
  products: cartProducts,
  totalQuantity: cartProducts.reduce((prev, curr) => prev + curr.quantity, 0),
  total: total,
});
   localStorage.setItem("orders", JSON.stringify(savedOrders));
    Swal.fire({
      title: "Order placed!",
      text: "Thank you for shopping with ShopStream.",
      icon: "success",
    }).then(() => {
      dispatch(clearCart());
      navigate("/");
    });
  }

  return (
    <div className="container">
      {cartProducts.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <h1 className="fw-bold">Secure Checkout</h1>
          <p className="text-secondary mb-4">
            Complete your order with ShopStream's verified protection.
          </p>

          <Row className="g-4">
            <Col lg={8}>
              <div className="border rounded-2 p-4 d-flex flex-column gap-3">
                <h5 className="fw-bold">🚚 Shipping Information</h5>

                <Row className="g-3">
                  <Col sm={6}>
                    <label className="fw-bold small">First Name</label>
                    <input type="text" className="form-control" placeholder="Adam"
                      value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Col>
                  <Col sm={6}>
                    <label className="fw-bold small">Last Name</label>
                    <input type="text" className="form-control" placeholder="Islam"
                      value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </Col>
                </Row>

                <div>
                  <label className="fw-bold small">Address</label>
                  <input type="text" className="form-control" placeholder="153 gesr elsuez st"
                    value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <Row className="g-3">
                  <Col sm={4}>
                    <label className="fw-bold small">City</label>
                    <input type="text" className="form-control" placeholder="Cairo"
                      value={city} onChange={(e) => setCity(e.target.value)} />
                  </Col>
                  <Col sm={4}>
                    <label className="fw-bold small">Zip Code</label>
                    <input type="text" className="form-control" placeholder="10001"
                      value={zip} onChange={(e) => setZip(e.target.value)} />
                  </Col>
                  <Col sm={4}>
                    <label className="fw-bold small">Phone Number</label>
                    <input type="text" className="form-control" placeholder="01273077033"
                      value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Col>
                </Row>
              </div>

              {error && <p className="text-danger mt-3 mb-0">{error}</p>}

              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary" className="fw-bold">
                  Place Order →
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className="border rounded-2 p-4 bg-primary-subtle">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex flex-column gap-3">
                  {cartProducts.map((p) => (
                    <div key={p.id} className="d-flex gap-3">
                      <img src={p.thumbnail} alt={p.title}
                        className="rounded-2 object-fit-cover"
                        style={{ width: "60px", height: "60px" }} />
                      <div>
                        <p className="fw-bold small mb-0">{p.title}</p>
                        <p className="text-secondary small mb-0">Qty: {p.quantity}</p>
                        <p className="text-primary fw-bold mb-0">
                          ${(p.price * p.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-secondary">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-secondary">Shipping</span>
                  <span className="fw-bold text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-secondary">Tax (Est.)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold">Total</span>
                  <span className="fs-5 fw-bold text-primary">${total.toFixed(2)}</span>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <input type="text" className="form-control" placeholder="Promo Code" />
                  <Button type="button" variant="outline-primary">Apply</Button>
                </div>

                <div className="bg-success-subtle rounded-2 p-3 mt-3 small">
                  <p className="mb-1">🛡️ 256-bit SSL Secure Payment</p>
                  <p className="mb-0">↩️ 30-Day Money Back Guarantee</p>
                </div>
              </div>
            </Col>
          </Row>
        </form>
      ) : (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3">
          <h2 className="fw-bold text-danger">Your cart is empty</h2>
          <Link to="/products"> Go To Products </Link>
        </div>
      )}
    </div>
  );
}