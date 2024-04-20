import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import Header from "../components/Header/Header";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { authToken } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/cart/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCartItems(response.data.cart_items);
        calculateTotalPrice(response.data.cart_items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [authToken]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const updatedQuantity = newQuantity >= 0 ? newQuantity : 0; // Ensure quantity doesn't go below 0
      await axios.put(
        `http://localhost:8000/api/update-cart/${itemId}/`,
        {
          quantity: updatedQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: updatedQuantity } : item
      );
      setCartItems(updatedCart);
      calculateTotalPrice(updatedCart);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/remove-from-cart/${itemId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const response = await axios.get("http://localhost:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCartItems(response.data.cart_items);
      calculateTotalPrice(response.data.cart_items);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <>
      <Header />
      <h1 className="cart-title">
        Your Cart
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-shopping-cart"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      </h1>

      {cartItems.length !== 0 ? (
        <div className="cart-page-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product.id}>
                  <td>
                    <img
                      className="cart-product-image"
                      src={`http://localhost:8000/${item.product.image}`}
                      alt={item.product.name}
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 0}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="0"
                        value={item.quantity}
                        onChange={(event) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(event.target.value)
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{item.product.price}</td>
                  <td>
                    <button
                      className="cartItem-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="checkout-section">
            <p className="dummy-text">
              No of Items in the cart : {cartItems.length}
            </p>
            <p>Total Price : {totalPrice}</p>
            <Link to={`/checkout?price=${totalPrice}`} className="checkout-btn">
          Checkout
        </Link>
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <h1>No Items In Your Cart</h1>
          <img
            src="https://cdn.dribbble.com/users/5107895/screenshots/14532312/media/a7e6c2e9333d0989e3a54c95dd8321d7.gif"
            alt="empty"
          />
        </div>
      )}
    </>
  );
};

export default CartPage;
