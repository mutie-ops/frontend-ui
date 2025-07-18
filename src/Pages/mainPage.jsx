import React from "react";
import SideNavigation from "../Components/sideNavigation.jsx";
import '../css/mainPage.css'
import Dashboard from "../Pages/Dashboard.jsx";
import Utilities from "../Pages/Utilities.jsx";
import Header from "../Components/Header.jsx";

function MainPage(){

    const [activeView, setActiveView] = React.useState("Dashboard")

    function renderView(){
        switch(activeView){
            case "Dashboard":
                return (<Dashboard />)
            case "Utilities":
                return (<Utilities />)
            default:
                return (<Dashboard />)
        }
    }

    return (
        <div className="main-page">
            <SideNavigation activeView={activeView} setActiveView={setActiveView}/>
           <div className="main-page-content">
               {/*<Header />*/}
               {renderView()}
           </div>
        </div>
    )
}
export  default MainPage;