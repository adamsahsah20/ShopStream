import {  useEffect, useState } from 'react'
import { themeContext } from './themeContext'
export default function ThemeProvider({children}) {
    let [theme,setTheme]=useState("light")
    useEffect(()=>{
        document.body.className=theme
    })
    let toggleTheme= () =>{
        setTheme((prev) => (prev == "light"? "dark" :"light"))
    }
  return (
    <themeContext.Provider value={{theme,toggleTheme}}>
        {children}
    </themeContext.Provider>
  )
}
