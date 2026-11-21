import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { registeredUsers } from "../Auth/Register";

export default function CartsAdmin() {
  let [carts, setCarts] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let perPage = 10;

  useEffect(() => {
    async function fetchCarts() {
      let saved = JSON.parse(localStorage.getItem("orders")) || [];
      let myOrders = saved.reverse().map((o) => {
        let me = registeredUsers.find((r) => r.email == o.userEmail);
        return { ...o, name: me ? me.name : o.userEmail, status: "Completed" };
      });
      try {
        let cartsRes = await axios.get("https://dummyjson.com/carts?limit=0");
        let usersRes = await axios.get(
          "https://dummyjson.com/users?limit=0&select=firstName,lastName"
        );
        let dummyCarts = cartsRes.data.carts.map((c) => {
          let u = usersRes.data.users.find((x) => x.id == c.userId);
          return {
            ...c,
            name: u ? u.firstName + " " + u.lastName : "User #" + c.userId,
            status: "Pending",
          };
        });
        setCarts([...myOrders, ...dummyCarts]);
      } catch {
        setCarts(myOrders);
      }
    }
    fetchCarts();
  }, []);

  let shown = carts.filter((o) => (o.name + " " + o.id).toLowerCase().includes(search.toLowerCase()));
  let totalPages = Math.ceil(shown.length / perPage);
  let pageItems = shown.slice((page - 1) * perPage, page * perPage);
  let totalSales = carts.reduce((prev, curr) => prev + curr.total, 0);
  let totalItems = carts.reduce((prev, curr) => prev + curr.totalQuantity, 0);

  return (
    <div>
      <h2 className="fw-bold mb-0">Orders</h2>
      <p className="text-secondary mb-4">All customer carts and orders.</p>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">TOTAL CARTS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{carts.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">TOTAL VALUE</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">${totalSales.toFixed(2)}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">TOTAL ITEMS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{totalItems}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <input
        type="text"
        className="form-control mb-3 w-50"
        placeholder="Search by customer or cart ID..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Table responsive hover bordered className="align-middle bg-white">
        <thead>
          <tr>
            <th>Cart</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((o) => (
            <tr key={o.id}>
              <td className="fw-bold">#{o.id}</td>
              <td>{o.name}</td>
              <td>{o.totalQuantity}</td>
              <td className="fw-bold text-primary">${o.total.toFixed(2)}</td>
              <td>
                <span
                  className={
                    o.status == "Completed"
                      ? "badge rounded-pill bg-success-subtle text-success"
                      : "badge rounded-pill bg-secondary-subtle text-secondary"
                  }
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <Button variant="outline-primary" disabled={page == 1} onClick={() => setPage(page - 1)}>
          ← Previous
        </Button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}