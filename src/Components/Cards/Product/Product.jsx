import React from 'react'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../RTK/slices/cartSlice'
import Swal from 'sweetalert2'

export default function Product({product}) {
  let dispatch=useDispatch()
  return (
    <Link  to={`/productDetails/${product.id}`} className="position-relative border border-1 rounded-2 p-3 pt-5 d-flex justify-content-center flex-column gap-3" style={{width:"300px"}}>
        {product.discountPercentage > 0 &&(<p className="position-absolute top-0 end-0 bg-danger text-white fs-6 rounded-1 px-2" >{product.discountPercentage}%</p>)}
        <img src={product.thumbnail} alt={product.title}/>
        <h2 className="text-dark fw-bold text-center text-decoration-none fs-6">{product.title}</h2>
        <p className="text-dark fw-bold text-center text-decoration-none">{product.rating}⭐</p>
        <p className="text-secondary text-center text-decoration-none fs-6">{product.description}</p>
        <p className="text-success text-center">${product.price}</p>
        <Button variant="outline-primary" 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
                                  Swal.fire({
                                    title: "Added to cart!",
                                    text: "You're product have been succesfully added to cart",
                                    icon: "success",
                                  }).then((result) => {
                                    
                                    if (result.isConfirmed) {
                                      dispatch(addToCart(product));
                                    }
                                  });
                                }}>
          Add to Cart</Button>
    </Link>
  )
}
