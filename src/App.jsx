import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './Layout/MainLayout'
import Home from './pages/Home/Home'
import Category from './pages/Category/Category'
import Products from './pages/Products/Products'
import Cart from './pages/Cart'
import ThemeProvider from './Context/ThemeProvider'
import ProductDetails from './Components/Cards/Product/ProductDetails'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Auth/Profile'
import Checkout from './pages/Checkout/Checkout'
import Dashboard from './pages/Dashboard/Dashboard'
import ProductsAdmin from './pages/Dashboard/ProductsAdmin'
import CartsAdmin from './pages/Dashboard/CartsAdmin'
import UsersAdmin from './pages/Dashboard/UsersAdmin'

function App() {
  let router=createBrowserRouter([{
    path:"/",
    element:<MainLayout/>,
    children:[
      {index:true, element:<Home/>},
      {path:"/products",element:<Products/>},
      {path:"/productDetails/:id",element:<ProductDetails/>},
      {path:"/category", element:<Category/>},
      {path:"/cart", element:<Cart/>},
      {path:"/register",element:<Register/>},
      {path:"/login",element:<Login/>},
      {path:"/profile",element:<Profile/>},
      {path:"/checkout",element:<Checkout/>}
    ]
  },
  {
    path:"Dashboard",
    element:<Dashboard/>,
    children:[
      {path:"products", element:<ProductsAdmin/>},
      {path:"carts",element:<CartsAdmin/>},
      {path:"users",element:<UsersAdmin/>}
      
    ]
  }, 



])

  return (
   <ThemeProvider>
    <RouterProvider router={router} />
   </ThemeProvider>
  )
}

export default App
