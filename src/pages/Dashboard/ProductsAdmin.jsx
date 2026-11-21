import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Card, Col, Modal, Row, Table } from "react-bootstrap";

export default function ProductsAdmin() {
  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [showModal, setShowModal] = useState(false);
  let [editing, setEditing] = useState(null);
  let [title, setTitle] = useState("");
  let [category, setCategory] = useState("");
  let [price, setPrice] = useState("");
  let [stock, setStock] = useState("");
  let [description, setDescription] = useState("");
  let [image, setImage] = useState("");
  let perPage = 8;

  useEffect(() => {
    async function fetchProducts() {
      let saved = JSON.parse(localStorage.getItem("products")) || [];
      try {
        let res = await axios.get(
          "https://dummyjson.com/products?limit=0&select=title,category,price,stock,thumbnail,description"
        );
        setProducts([...saved, ...res.data.products]);
      } catch {
        setProducts(saved);
      }
    }
    async function fetchCategories() {
      let res = await axios.get("https://dummyjson.com/products/category-list");
      setCategories(res.data);
    }
    fetchProducts();
    fetchCategories();
  }, []);

  function updateProducts(list) {
    setProducts(list);
    localStorage.setItem("products", JSON.stringify(list.filter((p) => p.local)));
  }

  let shown = products.filter((p) =>
    (p.title + " " + p.category).toLowerCase().includes(search.toLowerCase())
  );
  let totalPages = Math.ceil(shown.length / perPage);
  let pageItems = shown.slice((page - 1) * perPage, page * perPage);
  let lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  let outOfStock = products.filter((p) => p.stock == 0).length;

  function handleImage(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function openAdd() {
    setEditing(null);
    setTitle("");
    setCategory(categories[0] || "");
    setPrice("");
    setStock("");
    setDescription("");
    setImage("");
    setShowModal(true);
  }

  function openEdit(p) {
    setEditing(p);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setImage(p.thumbnail || "");
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    let data = {
      title: title,
      category: category,
      price: Number(price),
      stock: Number(stock),
      description: description,
    };
    if (editing) {
      if (!editing.local) {
        await axios.put(`https://dummyjson.com/products/${editing.id}`, data);
      }
      updateProducts(
        products.map((p) => (p.id == editing.id ? { ...p, ...data, thumbnail: image } : p))
      );
    } else {
      await axios.post("https://dummyjson.com/products/add", data);
      updateProducts([{ ...data, id: Date.now(), local: true, thumbnail: image }, ...products]);
    }
    setShowModal(false);
  }

  function handleDelete(p) {
    Swal.fire({
      title: "Delete this product?",
      text: p.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!p.local) {
          await axios.delete(`https://dummyjson.com/products/${p.id}`);
        }
        updateProducts(products.filter((x) => x.id != p.id));
      }
    });
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Product Inventory</h2>
          <p className="text-secondary mb-0">Manage your catalog, stock levels, and pricing.</p>
        </div>
        <Button variant="success" onClick={openAdd}>
          + Add New Product
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">TOTAL PRODUCTS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{products.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">LOW STOCK</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{lowStock}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">OUT OF STOCK</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{outOfStock}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <input
        type="text"
        className="form-control mb-3 w-50"
        placeholder="Search products by name or category..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Table responsive hover bordered className="align-middle bg-white">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="d-flex align-items-center">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="rounded-2 me-2"
                      style={{ width: "40px", height: "40px" }}
                    />
                  ) : (
                    <span className="me-2 fs-4">📦</span>
                  )}
                  <span className="fw-bold">{p.title}</span>
                </div>
              </td>
              <td>
                <span className="badge bg-primary-subtle text-primary text-capitalize">
                  {p.category}
                </span>
              </td>
              <td className="fw-bold">${Number(p.price).toFixed(2)}</td>
              <td className={p.stock == 0 ? "text-secondary" : p.stock < 10 ? "text-danger" : "text-success"}>
                {p.stock == 0
                  ? "Out of Stock"
                  : p.stock < 10
                  ? "Only " + p.stock + " Left"
                  : p.stock + " In Stock"}
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(p)}>
                  ✏️
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p)}>
                  🗑️
                </Button>
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
        <Button variant="outline-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next →
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Product" : "Add New Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <div>
              <label className="fw-bold small">Product Image</label>
              <input type="file" accept="image/*" className="form-control" onChange={handleImage} />
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="rounded-2 mt-2"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
            </div>
            <div>
              <label className="fw-bold small">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="fw-bold small">Category</label>
              <select
                className="form-select text-capitalize"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Row>
              <Col>
                <label className="fw-bold small">Price (USD)</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <label className="fw-bold small">Current Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <div>
              <label className="fw-bold small">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setShowModal(false)}>
              Discard
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}