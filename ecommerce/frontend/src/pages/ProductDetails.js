// ProductDetails.js

import React, { useState, useEffect, useContext } from 'react';
import './ProductDetails.css'; 
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import { AuthContext } from '../Context/AuthContext';



const ProductDetails = () => {
    
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [category,setCategory] = useState('');
    const [id,setId] = useState('');
    const { authToken } = useContext(AuthContext); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:8000/api/products/${productId}/`);
                setProduct(productResponse.data);
                setCategory(productResponse.data.category);
                setId(productResponse.data.id);
        
                const relatedResponse = await axios.get(`http://localhost:8000/api/related-products?category=${productResponse.data.category}&exclude_id=${productResponse.data.id}`);
                setRelatedProducts(relatedResponse.data);
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [productId]);
    

    if (!product) {
        return <div>Loading...</div>;
    }

    

    const addToCart = async (productId) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/add-to-cart/',
                { product_id: productId},
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding item to cart');
        }
    };
    

    return (
        <div className='main-product-details-container'>
        <Link to={'/'} className='back-btn'>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
        <div className="product-details-container">
            <div className="product-image">
                <img src={product.image} alt="Product" />
            </div>
            <div className="product-info">
                <h2 className='pname'>{product.name}</h2>
                <p className='desc'>{product.description}</p>
                <p className='price'>Price: ₹{product.price}</p>
                <button className='cart-btn' onClick={() => addToCart(productId)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Add to Cart</button>
            </div>
        </div>
        <h2 className='related-products-title'>Related Products</h2>
        <div className='related-products-container'>
            {relatedProducts.map(product => (
                <Link to={`/products/${product.id}`} className='link' key={product.id}>
                   <ProductCard data={product}/>
                </Link>
                ))}
        </div>
        <Footer/>
        </div>
    );
};


export default ProductDetails;
