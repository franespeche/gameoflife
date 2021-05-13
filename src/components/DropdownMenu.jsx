import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group';

const DropdownMenu = ({children}) => {
    const [activeMenu, setActiveMenu] = useState('main')

    return (
        <div className='dropdown-menu'>
            {/* <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}> */}

            {children}
        </div>
    )
}

export default DropdownMenu
