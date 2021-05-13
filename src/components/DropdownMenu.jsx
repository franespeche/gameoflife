import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group';

const DropdownMenu = ({children}) => {
    const [activeMenu, setActiveMenu] = useState('main')

    return (
        <div className='dropdown-menu'>
            {children}
        </div>
    )
}

export default DropdownMenu
