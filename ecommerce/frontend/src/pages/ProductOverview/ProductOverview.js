import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductOverview.css';
import ProductDetails from '../ProductDetails';

const ProductOverview = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category,setCategory] = useState();


    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/api/products?category=${category}`);
                setProducts(response.data);
            } catch (error) {
                setError('Error fetching products');
            }
            setLoading(false);
        };

        fetchProductsByCategory();
    }, [category]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

  return (
    <div className='products-overview-container'>
        <ProductDetails/>
        <div className='related-products-container'>
        <h2 className='not-found'>Related Products</h2>
        </div>
    </div>
  )
}

export default ProductOverview