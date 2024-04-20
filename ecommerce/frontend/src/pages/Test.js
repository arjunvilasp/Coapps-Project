import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';
import { AuthContext } from '../Context/AuthContext';

const CartPage = () => {
    const { authToken } = useContext(AuthContext); 
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/cart/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                    },
                });
                setCartItems(response.data.cart_items);
                console.log(response.data.cart_items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [authToken]);

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8000/api/remove-from-cart/${itemId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            // Refresh cart items after removal
            const response = await axios.get('http://localhost:8000/api/get-cart-items/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setCartItems(response.data.cart_items);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <div className="cart-container">
            <h1>Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="product-info">
                                <img src={item.product.image} alt={item.product.name} />
                                <div>
                                    <h3>{item.product.name}</h3>
                                    <p>Price: ${item.product.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartPage;
