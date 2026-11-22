import axios from 'axios'
import  {  useEffect, useState } from 'react'
import Product from '../../Components/Cards/Product/Product'
import {  useSearchParams } from 'react-router'


export default function Products() {
  let [searchParams]=useSearchParams()
  let [products,setProducts]=useState([])
  let [categories,setCategories]=useState([])
  let [category,setCategory]=useState(searchParams.get("category") || "")
  let [sort,setSort]=useState("")
  
  let query=searchParams.get("q") || ""

  useEffect(()=>{
    async function fetchCategories() {
      let res=await axios.get("https://dummyjson.com/products/category-list")
      setCategories(res.data)
    }
    fetchCategories()
  },[])

  useEffect(()=> {
    let saved=JSON.parse(localStorage.getItem("products")) || []
    let mine=saved.filter((p)=> query ? p.title.toLowerCase().includes(query.toLowerCase()) : category ? p.category == category : true)

    async function fetchProducts() {
      let res=await axios.get(`https://dummyjson.com/products?${sort}`)
      setProducts([...mine,...res.data.products])
    }
    async function SearchProducts() {
      let res=await axios.get(`https://dummyjson.com/products/search?q=${query}&${sort}`)
      setProducts([...mine,...res.data.products])
    }
    async function fetchByCategory() {
      let res=await axios.get(`https://dummyjson.com/products/category/${category}?${sort}`)
      setProducts([...mine,...res.data.products])
    }
    if(query){
      SearchProducts()
    }
    else if(category){
      fetchByCategory()
    }
    else{
      fetchProducts()
    }
  },[query,category,sort])

  return (
    <div className="d-flex gap-4 px-4">
      <div style={{width:"220px"}}>
        <h6 className="text-uppercase text-primary">Category</h6>
        <div style={{height:"300px" , overflowY:"auto"}}>
          {categories.map((c) => (
            <div key={c}>
              <label className="form-check-label text-capitalize text-info">
                <input
                  type="checkbox"
                  className="form-check-input me-2 bg-info "
                  checked={category === c}
                  onChange={()=>setCategory(category === c ? "" : c)}
                />
                {c}
              </label>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-primary mt-3 w-100" onClick={()=>setCategory("")}>
          Clear filters
        </button>
      </div>

      <div>
        <select className="form-select w-auto ms-auto mb-3" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="sortBy=price&order=asc">Lowest price</option>
          <option value="sortBy=price&order=desc">Highest Price</option>
          <option value="sortBy=rating&order=desc">Highest rating</option>
          <option value="sortBy=title&order=asc">Title</option>
        </select>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {products.map((p) => (
            <Product key={p.id} product={p}/>
          ))}
        </div>
      </div>
    </div>
  )
}