import React from 'react'
import './ProductCard.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductCard = ({data}) => {
  return (
    <div className='product-card-container'>
        <div className='product-img'>
            <img src={data.image} alt='product-img'/>
        </div>
        <div className='product-details'>
            <p className='product-name'>{data.name}</p>
            <p className='product-price'>₹{data.price}</p>
        </div>
    </div>
  )
}

export default ProductCard