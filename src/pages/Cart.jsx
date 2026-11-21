import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../RTK/slices/cartSlice";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function Cart() {
  let cartProducts = useSelector((state) => state.cart);
  let dispatch = useDispatch();
  let navigate=useNavigate()
  let subtotal = cartProducts.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0);
  let tax = subtotal * 0.08;
  let total = subtotal + tax;
  return (
    <div className="container">
      {cartProducts.length > 0 ? (
        <>
          <h1 className="fw-bold mb-4">Your Shopping Cart</h1>
          <Row className="g-4">
            <Col lg={8} className="d-flex flex-column gap-3">
              {cartProducts.map((p) => (
                <Card key={p.id}>
                  <Card.Body className="d-flex gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="rounded-2 object-fit-cover"
                      style={{ width: "100px", height: "100px" }}
                    />

                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-1">{p.title}</h5>
                        <p className="text-secondary small mb-0">
                          {p.brand && `${p.brand} | `}
                          {p.category}
                        </p>
                      </div>

                      <ButtonGroup style={{ width: "fit-content" }}>
                        <Button
                          variant="light"
                          onClick={() => {
                            dispatch(decreaseQuantity(p));
                          }}
                          disabled={p.quantity <= 1}>
                          -
                        </Button>
                        <span className="d-flex align-items-center px-3 fw-bold">
                          {p.quantity}
                        </span>
                        <Button
                          variant="light"
                          onClick={() => {
                            dispatch(increaseQuantity(p));
                          }}>
                          +
                        </Button>
                      </ButtonGroup>
                    </div>

                    <div className="d-flex flex-column justify-content-between align-items-end">
                      <p className="text-primary fw-bold fs-5 mb-0">
                        ${p.price.toFixed(2)}
                      </p>
                      <Button
                        variant="link"
                        className="text-danger text-decoration-none fw-bold p-0"
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#198754",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              dispatch(removeFromCart(p));
                            }
                          });
                        }}>
                        🗑️ Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card className="sticky-top" style={{ top: "80px" }}>
                <Card.Body>
                  <h4 className="fw-bold mb-3">Order Summary</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Subtotal</span>
                    <span className="fw-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Shipping</span>
                    <span className="fw-bold text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Estimated Tax</span>
                    <span className="fw-bold">${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fs-4 fw-bold">Total</span>
                    <span className="fs-4 fw-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center gap-3 bg-primary-subtle rounded-2 p-3">
                    <span className="fs-4">🚚</span>
                    <div>
                      <p className="fw-bold small mb-0">Free Express Delivery</p>
                      <p className="text-secondary small mb-0">
                        Arrives by Oct 24 - 26
                      </p>
                    </div>
                  </div>
                  <div>
                      <button variant="outline-info mt-3 ms-4" className="btn btn-primary mt-3 ms-5 w-75 text-white" onClick={()=>navigate("/checkout")}>Proceed to checkout →</button>
                    </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3">
          <h2 className="fw-bold text-danger">No Products in cart</h2>
          <Link to="/products"> Go To Products </Link>
        </div>
      )}
    </div>
  );
}