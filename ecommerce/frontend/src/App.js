// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import WithAuth from './Auth'; // Import the WithAuth component
import Register from './pages/Register';
import ProductsCategory from './pages/ProductsCategory/ProductsCategory';
import Profile from './pages/Profile';
import CheckoutPage from './pages/CheckotPage/CheckoutPage';

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route path="/products/:productId" element={<WithAuth><ProductDetails /></WithAuth>} /> {/* Protected route */}
                    <Route path="/products/category/:category" element={<WithAuth><ProductsCategory /></WithAuth>} /> {/* Protected route */}
                    <Route path='/cart' element={<WithAuth><Cart /></WithAuth>} /> {/* Protected route */}
                    <Route path="/profile" element={<WithAuth><Profile/></WithAuth>} /> {/* Protected route */}
                    <Route path="/checkout" element={<WithAuth><CheckoutPage/></WithAuth>} /> {/* Protected route */}
                </Routes>
            </Router>
        </div>
    );
};

export default App;
