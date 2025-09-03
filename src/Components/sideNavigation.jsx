import React from 'react';
import '../css/sideNavigation.css'


function SideNavigation({activeView,setActiveView}) {

    return (
        <div className='container'>
            <ul>
                <li className={activeView === "Dashboard" ? 'active' : ''}
                    onClick={() => setActiveView('Dashboard')}>Dashboard
                </li>
                <li className={activeView === "Utilities" ? 'active' : ''}
                    onClick={() => setActiveView('Utilities')}>Utilities
                </li>
            </ul>
        </div>
    )
}

export default SideNavigation