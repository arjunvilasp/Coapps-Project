import React, { useEffect, useState } from 'react'
import './ProductsCategory.css'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Header from '../../components/Header/Header';
import SubNav from '../../components/SubNavbar/SubNav';

const ProductsCategory = () => {

    
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/api/related-products?category=${category}`);
                setProducts(response.data);
                console.log(response.data);
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
    <div className='category-container'>
        <Header/>
        <SubNav/>
        <h1>Category - {category}</h1>
        {
            products.length != 0 ? 
            <div className='products-by-category'>
        {products.map(product => (
                <Link to={`/products/${product.id}`} className='link' key={product.id}>
                   <ProductCard data={product}/>
                </Link>
                ))}
        </div>
        :
        <h1 className='not-found'>No Products Available</h1>
        }
    </div>
  )
}

export default ProductsCategory