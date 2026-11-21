import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cart",
    initialState:[],
    reducers:{
        addToCart:(state,action) =>{
            let existedProducts=state.find((p) => p.id == action.payload.id)
            if(!existedProducts){
                let newProducts={...action.payload,quantity:1}
                state.push(newProducts)
            }
            else{
                existedProducts.quantity++
            }
        },
        removeFromCart:(state,action) => {
            return state.filter((p)=> p.id != action.payload.id)
        },
        increaseQuantity:(state,action) =>{
            let existedProducts=state.find((p) => p.id == action.payload.id)
            if(existedProducts){
                existedProducts.quantity++
            }
        },
        decreaseQuantity:(state,action) =>{
            let existedProducts=state.find((p)=> p.id == action.payload.id)
            if(existedProducts){
                existedProducts.quantity--
            }
        },
        clearCart:() =>{
            return []
        }
    }
})

export let { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
