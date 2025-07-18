import './App.css'
import {BrowserRouter, Route, Router, Routes} from "react-router";
import {StrictMode, React} from "react";
import LoginPage from './Pages/LoginPage'
import MainPage from "./Pages/mainPage";
function App() {

  return (
    <>
      <BrowserRouter>
        <StrictMode>
           <Routes>
             <Route index element={<LoginPage />} />
               <Route path= '/main' element={ <MainPage />} />

           </Routes>
        </StrictMode>
      </BrowserRouter>
    </>
  )
}

export default App
