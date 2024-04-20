// CheckoutPage.js

import React, { useState } from 'react';
import './CheckoutPage.css';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const totalPrice = params.get('price');

    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
        totalPrice: totalPrice || '', // Set default value to totalPrice or empty string
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/checkout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
            alert('Payment successful.');
            window.location.reload();
            } else {
                console.error('Checkout failed.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="main-checkout-container">
            <div className="checkout-container">
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit} className="payment-form">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" placeholder="Enter card number" required onChange={handleChange} />

                    <label htmlFor="expiry">Expiry Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required onChange={handleChange} />
                    
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="CVV" required onChange={handleChange} />

                    <label htmlFor="name">Cardholder Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter cardholder name" required onChange={handleChange} />

                    <label htmlFor="totalPrice">Total Price</label>
                    <input type="text" id="totalPrice" name="totalPrice" value={formData.totalPrice} readOnly />

                    <button type="submit" className="pay-button">Pay Now</button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
