import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center 
bg-[#16181c]/80 backdrop-blur-md 
border-b border-gray-800 text-gray-100 
px-6 py-3 fixed top-0 left-0 right-0 z-50">

      {/* Logo */}
      <div className="logo">
        <span className='font-bold text-xl tracking-wide cursor-pointer'>
          Taskify
        </span>
      </div>

      {/* Menu */}
      <ul className='flex gap-8 items-center text-sm font-medium'>
        <li className='cursor-pointer text-gray-400 hover:text-white transition-all duration-200'>
          Home
        </li>

        <li className='cursor-pointer text-gray-400 hover:text-white transition-all duration-200'>
          Your Tasks
        </li>
      </ul>

    </nav>
  )
}

export default Navbar
