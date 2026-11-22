import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router'
import { addToCart } from '../../../RTK/slices/cartSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export default function ProductDetails() {
    let {id}=useParams();
    let dispatch=useDispatch()
    let [product,setProduct]=useState({})
    useEffect(()=> {
        async function fetchProduct() {
            let saved=JSON.parse(localStorage.getItem("products")) || []
            let mine=saved.find((p)=> p.id == id)
            if(mine){
                setProduct(mine)
                return
            }
            let res= await axios.get(`https://dummyjson.com/products/${id}`)
            setProduct(res.data)
        }
        fetchProduct()
    },[id])
  return (
    <div>
        {product.discountPercentage > 0 &&(<p className="position-sticky d-flex bg-danger top-0 end-0 text-white fs-6 rounded-1" style={{width:"100px"}}>{product.discountPercentage}%</p>)}
        <img src={product.thumbnail} alt={product.title} style={{maxWidth:"300px",marginLeft:"520px"}} className="d-block mx-auto img-fluid"/>
        <h2 className="text-dark fw-bold text-center">⭐{product.title}</h2>
        <p className="text-dark fw-bold text-center">{product.rating}</p>
        <p className="text-secondary text-center">{product.description}</p>
        <p className="text-success text-center">${product.price}</p>
    
       <div className="text-center">
         <Button variant="outline-primary"   onClick={(e) => {
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
                                        }}>Add to Cart</Button>
       </div>
        
    </div>
  )
}