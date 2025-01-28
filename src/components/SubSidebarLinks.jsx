import React from 'react'
import { NavLink } from 'react-router-dom'

function SubSidebarLinks({ to, label }) {
    return (
        <div className='p-1 pl-0 flex flex-col gap-1'>
            <NavLink
                to={to ? to : "#"}
                className={({ isActive }) =>
                    (isActive ? "pl-3 font-medium text-lg" : " pl-3 font-normal text-grey-13 text-lg")
                }
            >
                {label}
            </NavLink>
        </div>
    )
}

export default SubSidebarLinks