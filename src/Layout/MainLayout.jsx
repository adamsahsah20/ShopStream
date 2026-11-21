import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <div>
        <Navbar/>
        <main className="d-flex jusitify-content-center flex-column py-5">
            <Outlet/>
        </main>

        <footer className="bg-primary-subtle py-4">
  <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
    <div>
      <h6 className="fw-bold text-primary mb-1">ShopStream</h6>
      <p className="text-secondary small mb-0">
        The premium destination for curated technology and lifestyle products.
      </p>
    </div>

   <div className="d-flex gap-4 small">
  <p className="mb-0">Privacy Policy</p>
  <p className="mb-0">Terms of Service</p>
  <p className="mb-0">Contact Us</p>
  <p className="mb-0">Shipping Info</p>
</div>

    <p className="text-secondary small mb-0">
      © 2024 ShopStream Inc. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  )
}
