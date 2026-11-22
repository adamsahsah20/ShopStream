import React, { useContext, useState } from 'react'
import { themeContext } from '../Context/themeContext'
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../RTK/slices/authSlice';
import { Dropdown } from 'react-bootstrap';

export default function Navbar() {
  let {theme,toggleTheme}=useContext(themeContext)
  let [query,setQuery]=useState("")
  let user=useSelector((state) =>state.auth.user)
  let dispatch=useDispatch()
  let navigate=useNavigate()
  let links=[
    {to:"/" , name:"Home"},
    {to:"/products" , name:"Products"},
    {to:"/category" , name:"Category"},
  ];

  return (
    <header className="position-relative top-0 start-0 d-flex flex-wrap justify-content-between align-items-center gap-2 px-4 py-2 z-3">
        <h3 className="order-1 text-primary px-3 py-1 fw-bold text-capitalize mb-0">ShopStream</h3>
        <nav className="order-3 order-md-2 col-12 col-md-auto d-flex justify-content-center align-items-center gap-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({isActive}) =>isActive ?"text-primary" :"text-decoration-none"}>
                {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="order-4 order-md-3 col-12 col-md-auto">
         <input
          className="form-control"
          placeholder="Search Products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            navigate(`/products?q=${e.target.value}`)
          }}
          />
        </div>
        <div className="order-2 order-md-4 d-flex justify-content-between align-items-center gap-3" >
            <Link to="/cart" className="text-info text-decoration-none p-2">🛒</Link>
            <Dropdown align="end">
  <Dropdown.Toggle variant="link" bsPrefix="p-0 border-0 fs-4 text-decoration-none">👤</Dropdown.Toggle>
  <Dropdown.Menu>
    {user ? (
      <>
        <Dropdown.ItemText className="fw-bold">{user.firstName || user.name || user.username}</Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
        <Dropdown.Item onClick={()=> { dispatch(logout()); navigate("/") }}>Logout</Dropdown.Item>
      </>
    ) : (
      <>
        <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
        <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
      </>
    )}
  </Dropdown.Menu>
</Dropdown>
            <button className="border border-0 bg-transparent" onClick={()=> toggleTheme()}>{theme == "light" ? "🌙" : "🔆"}</button>
        </div>
    </header>
  )
}