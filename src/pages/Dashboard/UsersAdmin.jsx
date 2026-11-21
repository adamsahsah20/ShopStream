import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Card, Col, Modal, Row, Table } from "react-bootstrap";
import { registeredUsers } from "../Auth/Register";

export default function UsersAdmin() {
  let [users, setUsers] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [showModal, setShowModal] = useState(false);
  let [editing, setEditing] = useState(null);
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let[password,setPassword]=useState("")
  let [role, setRole] = useState("user");
  let perPage = 8;

  function saveRegistered(list) {
    localStorage.setItem("users", JSON.stringify(list));
    registeredUsers.length = 0;
    registeredUsers.push(...list);
  }

  useEffect(() => {
    async function fetchUsers() {
  let saved = JSON.parse(localStorage.getItem("users")) || [];
  let myUsers = saved.map((u, i) => ({
    id: "reg-" + i,
    firstName: u.name.split(" ")[0],
    lastName: u.name.split(" ").slice(1).join(" "),
    username: u.username || "",
    email: u.email,
    password:u.password,
    role: u.role || "user",
    local: true,
    registered: true,
  }));
  try {
    let res = await axios.get(
      "https://dummyjson.com/users?limit=0&select=firstName,lastName,username,email,role"
    );
    setUsers([...myUsers, ...res.data.users]);
  } catch {
    setUsers(myUsers);
  }
}
    fetchUsers();
  }, []);

  let shown = users.filter((u) =>
    (u.firstName + " " + u.lastName + " " + u.username + " " + u.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  let totalPages = Math.ceil(shown.length / perPage);
  let pageItems = shown.slice((page - 1) * perPage, page * perPage);
  let admins = users.filter((u) => u.role == "admin").length;
  let moderators = users.filter((u) => u.role == "moderator").length;

  function openAdd() {
    setEditing(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("")
    setRole("user");
    setShowModal(true);
  }

  function openEdit(u) {
    setEditing(u);
    setFirstName(u.firstName);
    setLastName(u.lastName);
    setUsername(u.username);
    setEmail(u.email);
    setPassword(u.password || "");
    setRole(u.role);
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    let data = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
      role: role,
    };
    let saved = JSON.parse(localStorage.getItem("users")) || [];
    if (editing) {
      if (editing.registered) {
        saveRegistered(
          saved.map((s) =>
            s.email == editing.email
              ? { ...s, name: firstName + " " + lastName, username: username, email: email, password: password, role: role }
              : s
          )
        );
      } else if (!editing.local) {
        await axios.put(`https://dummyjson.com/users/${editing.id}`, data);
      }
      setUsers(users.map((u) => (u.id == editing.id ? { ...u, ...data } : u)));
    } else {
      if (saved.find((s) => s.email == email || s.username == username)) {
        Swal.fire({
          title: "User already exists",
          text: "This email or username is already registered.",
          icon: "error",
        });
        return;
      }
      await axios.post("https://dummyjson.com/users/add", data);
      saveRegistered([
        ...saved,
        { name: firstName + " " + lastName, username: username, email: email, password: password, role: role },
      ]);
      setUsers([{ ...data, id: "reg-" + Date.now(), local: true, registered: true }, ...users]);
    }
    setShowModal(false);
  }

  function handleDelete(u) {
    Swal.fire({
      title: "Delete this user?",
      text: u.firstName + " " + u.lastName,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (u.registered) {
          let saved = JSON.parse(localStorage.getItem("users")) || [];
          saveRegistered(saved.filter((s) => s.email != u.email));
        } else if (!u.local) {
          await axios.delete(`https://dummyjson.com/users/${u.id}`);
        }
        setUsers(users.filter((x) => x.id != u.id));
      }
    });
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0">User Directory</h2>
          <p className="text-secondary mb-0">Manage your customers and their roles.</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          + Add New User
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">TOTAL USERS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{users.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">ADMINS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{admins}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-primary-subtle">
            <Card.Body>
              <Card.Text className="text-secondary small mb-1">MODERATORS</Card.Text>
              <Card.Title className="fw-bold fs-3 mb-0">{moderators}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <input
        type="text"
        className="form-control mb-3 w-50"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Table responsive hover bordered className="align-middle bg-white">
        <thead>
          <tr>
            <th>User</th>
            <th>Email Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((u) => (
            <tr key={u.id}>
              <td>
                <p className="fw-bold mb-0">
                  {u.firstName} {u.lastName}
                </p>
                <p className="text-secondary small mb-0">@{u.username}</p>
              </td>
              <td>{u.email}</td>
              <td>
                <span
                  className={
                    u.role == "admin"
                      ? "badge bg-primary-subtle text-primary text-capitalize"
                      : "badge bg-secondary-subtle text-secondary text-capitalize"
                  }
                >
                  {u.role}
                </span>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(u)}>
                  ✏️
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u)}>
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
            <Modal.Title>{editing ? "Edit User" : "Add New User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Row>
              <Col>
                <label className="fw-bold small">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <label className="fw-bold small">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <div>
              <label className="fw-bold small">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="fw-bold small">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="fw-bold small">Password</label>
              <input
                type="text"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editing}
              />
            </div>
            <div>
              <label className="fw-bold small">Role</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
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