import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateItemQuantity, removeItem, clearCart } = useCart();
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [isCustomizationOpen, setCustomizationOpen] = useState({});
  const [customizations, setCustomizations] = useState({});
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetch('db.json')
      .then((res) => res.json())
      .then((data) => setSuggestedItems(data.foodItems));
  }, []);

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) updateItemQuantity(id, quantity);
  };

  const handleCustomizationToggle = (id) => {
    setCustomizationOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCustomizationChange = (id, value) => {
    setCustomizations((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!userName || !userPhone) {
      alert('Please provide your name and phone number to place the order.');
      return;
    }

    const orderDetails = {
      name: userName,
      phone: userPhone,
      cartItems,
      totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '49dfa941-0704-4a4a-9210-872f1bb719c0',
        subject: 'New Order from Nursery Cart',
        message: JSON.stringify(orderDetails, null, 2),
      }),
    });

    if (response.ok) {
      clearCart();
      setUserName('');
      setUserPhone('');
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } else {
      alert('Failed to place the order. Please try again later.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg relative">
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center p-8 rounded-lg shadow-xl">
            <svg 
              className="mx-auto mb-4 w-24 h-24 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h2>
            <p className="text-xl text-gray-600 mb-4">Your order has been successfully submitted.</p>
            <p className="text-md text-gray-500">We'll process your order shortly.</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-3 text-gray-800">Your Cart</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
        <input
          type="tel"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your phone number"
        />
      </div>

      {cartItems.length > 0 ? (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row items-start bg-white rounded-lg shadow-lg mb-4 p-4 relative"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full md:w-32 h-32 object-cover rounded-lg mb-4 md:mb-0"
                />
                <div className="flex-grow pl-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h3>
                  <div className="flex items-center justify-between w-72 bg-gray-100 rounded-lg px-4 py-1 shadow-md text-gray-800">
                    <p className="text-md font-bold">₹{item.price}</p>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-2 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        -
                      </button>
                      <span className="text-md font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p
                      className="text-sm font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleCustomizationToggle(item.id)}
                    >
                      Customize your food
                    </p>
                    {isCustomizationOpen[item.id] && (
                      <textarea
                        rows="3"
                        cols="50"
                        value={customizations[item.id] || ''}
                        onChange={(e) => handleCustomizationChange(item.id, e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Add your customization request..."
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-gray-300 pt-4">
            <p className="text-xl font-bold text-gray-800">
              Amount to Pay: ₹{cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Place Order
            </button>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">More items you may like</h3>
            <ul className="flex space-x-4">
              {suggestedItems.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 min-w-[150px] flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm font-bold text-green-600">₹{item.price}</p>
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="mt-2 px-4 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-800">Your cart is empty</p>
      )}

      <Link to="/">
        <div className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg cursor-pointer hover:scale-105 transition-all">
          <div className="flex items-center">
            <p className="text-white font-semibold text-lg px-2">Menu Card</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Cart;