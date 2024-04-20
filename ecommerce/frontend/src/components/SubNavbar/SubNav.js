import React from 'react'
import './SubNav.css'
import { Link } from 'react-router-dom'


const SubNav = () => {
  return (
    <div className='subnav-container'>
      <div className='categories'>
        <Link to={'/products/category/home&kitchen'} className='category'>Home&Kitchen</Link>
        <Link to={'/products/category/grocery'} className='category'>Groceries</Link>
        <Link to={'/products/category/electronics'} className='category'>Electronics</Link>
        <Link to={'/products/category/beauty'} className='category'>Beauty</Link>
        <Link to={'/products/category/sports'} className='category'>Sports</Link>
      </div>
    </div>
  )
}

export default SubNav;