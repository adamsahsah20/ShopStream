import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Button, Card, Col, Row } from "react-bootstrap";
import Product from "../../Components/Cards/Product/Product";

export default function Home() {
  let [category, setCategory] = useState([]);
  let [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchCategory() {
      let res = await axios.get("https://dummyjson.com/products/category-list");
      let data = res.data;
      setCategory(data);
    }
    fetchCategory();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      let res = await axios.get("https://dummyjson.com/products?limit=6");
      let data = res.data.products;
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Row className="align-items-center bg-primary-subtle rounded-2 p-4 my-4">
        <Col lg={6}>
          <h1 className="fw-bold">
            Experience the Future of <span className="text-primary">Innovation.</span>
          </h1>
          <p className="text-secondary">
            Explore our curated selection of premium electronics, designed to
            elevate your daily stream of life.
          </p>
          <Button as={Link} to="/products" variant="primary" className="me-2">
            Shop Products
          </Button>
          
        </Col>
        <Col lg={6} className="text-center fs-1">
          {products[0] && (
    <img
      src={products[0].thumbnail}
      alt={products[0].title}
      className="img-fluid"
      style={{ maxHeight: "300px" }}
    />
  )}
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-5">
        <h3 className="fw-bold">Top Categories</h3>
        <Link to="/products">See All →</Link>
      </div>
      <Row className="g-3">
        {category.slice(0, 4).map((c) => (
          <Col key={c} sm={6} lg={3}>
            <Card
              as={Link}
              to={`/products?category=${c}`}
              className="bg-dark text-white text-decoration-none"
            >
              <Card.Body className="pt-5">
                <Card.Title className="text-capitalize">{c}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="fw-bold mt-5">Featured Products</h3>
      <Row className="g-4 mb-5">
        {products.map((p) => (
          <Col key={p.id} sm={5} lg={4}>
            <Product product={p} />
          </Col>
        ))}
      </Row>
    </div>
  );
}