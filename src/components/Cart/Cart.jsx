import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  FaTrashAlt,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaUtensils,
  FaQrcode,
  FaWhatsapp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateItemQuantity, removeItem, clearCart, addItem } = useCart();
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState({
    placed: false,
    message: '',
    orderNumber: null
  });
  const [paymentStatus, setPaymentStatus] = useState({
    isPaid: false,
    transactionId: null
  });
  const [showQRModal, setShowQRModal] = useState(false);

  const ADMIN_WHATSAPP = "9834153020"; // Replace with actual admin WhatsApp number

  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setSuggestedItems(data.foodItems || []);
      } catch (error) {
        console.error('Error fetching suggested items:', error);
      }
    };

    fetchSuggestedItems();
  }, []);

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!customerDetails.name.trim()) errors.name = 'Name is required';
    if (!customerDetails.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (customerDetails.phoneNumber.trim().length !== 10) errors.phoneNumber = 'Invalid phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentVerification = async (transactionId) => {
    // In a real implementation, verify the transaction with your backend
    try {
      // Simulate payment verification
      const response = await new Promise(resolve =>
        setTimeout(() => resolve({ success: true }), 1500)
      );

      if (response.success) {
        setPaymentStatus({
          isPaid: true,
          transactionId: transactionId
        });
        setShowQRModal(false);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please try again.');
    }
  };

  const sendWhatsAppNotification = async (orderData) => {
    const message = encodeURIComponent(`
🔔 New Order #${orderData.orderNumber}

👤 Customer: ${orderData.customerName}
📱 Phone: ${orderData.phoneNumber}
💰 Amount Paid: ₹${orderData.totalAmount}
🧾 Transaction ID: ${paymentStatus.transactionId}

📋 Order Details:
${orderData.items.map(item => `
• ${item.name} x${item.quantity} - ₹${item.total}`).join('')}

Total: ₹${orderData.totalAmount}
    `);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlaceOrder = async () => {
    if (!paymentStatus.isPaid) {
      alert('Please complete the payment first');
      return;
    }

    if (validateForm() && cartItems.length > 0) {
      const orderNumber = Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        customerName: customerDetails.name,
        phoneNumber: customerDetails.phoneNumber,
        orderNumber: orderNumber,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: (item.price * item.quantity).toFixed(2)
        })),
        totalAmount: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      try {
        // Send WhatsApp notification
        await sendWhatsAppNotification(orderData);

        // Clear cart and reset states
        clearCart();
        setCustomerDetails({ name: '', phoneNumber: '' });
        setPaymentStatus({ isPaid: false, transactionId: null });

        setOrderStatus({
          placed: true,
          message: `Order #${orderNumber} Placed Successfully!`,
          orderNumber: orderNumber
        });

        setTimeout(() => {
          setOrderStatus({
            placed: false,
            message: '',
            orderNumber: null
          });
        }, 10000);
      } catch (error) {
        console.error('Order submission error:', error);
        alert('Failed to place order. Please try again.');
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const PaymentQRModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Scan & Pay</h3>
          <button
            onClick={() => setShowQRModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/phonepayqr.jpeg"
              alt="Payment QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">₹{calculateTotal()}</p>
            <p className="text-gray-600 mt-2">Scan with PhonePe or Google Pay</p>
          </div>

          {/* For demo purposes - in production, this would be handled by actual payment gateway */}
          <button
            onClick={() => handlePaymentVerification('DEMO' + Date.now())}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Verify Payment
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 mt-12">
      {showQRModal && <PaymentQRModal />}

      {/* Order Status Notification */}
      {orderStatus.placed && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white p-6 rounded-2xl shadow-2xl flex items-center animate-bounce">
          <FaCheckCircle className="mr-3 text-3xl" />
          <div>
            <h3 className="text-2xl font-bold">{orderStatus.message}</h3>
            <p className="text-sm">Your order will be prepared shortly</p>
          </div>
        </div>
      )}

      {/* Main Cart Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
            <FaShoppingCart className="mr-3 text-red-500" /> Your Cart
          </h2>

          {/* Payment Status Banner */}
          {paymentStatus.isPaid && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <FaCheckCircle className="mr-2" />
              Payment Completed - Transaction ID: {paymentStatus.transactionId}
            </div>
          )}

          {/* Customer Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleCustomerDetailsChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your name"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={customerDetails.phoneNumber}
                onChange={handleCustomerDetailsChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number"
                maxLength="10"
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-red-50 rounded-2xl">
              <FaUtensils className="text-4xl sm:text-6xl text-red-400 mb-4" />
              <p className="text-xl sm:text-2xl text-red-500 font-semibold mb-4">Your cart is empty</p>
              <Link
                to="/"
                className="px-6 py-2 sm:px-8 sm:py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg mr-3 sm:mr-4 shadow-md"
                    />
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <span className="text-red-600 font-bold text-base sm:text-lg">₹{item.price}</span>
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-full p-1 shadow-md">
                          <button
                            onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="bg-gray-100 p-1 sm:p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <FaMinus className="text-xs sm:text-base text-gray-600" />
                          </button>
                          <span className="px-2 sm:px-4 font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-100 p-1 sm:p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <FaPlus className="text-xs sm:text-base text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 sm:ml-4 text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full"
                    >
                      <FaTrashAlt className="text-sm sm:text-base" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total and Place Order */}
              <div className="bg-red-50 p-4 sm:p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-lg sm:text-xl font-bold text-gray-800">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold text-red-600">₹{calculateTotal()}</span>
                </div>

                {!paymentStatus.isPaid ? (
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg text-base sm:text-lg font-bold mb-3 flex items-center justify-center"
                  >
                    <FaQrcode className="mr-2" /> Pay Now
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-red-600 text-white py-3 sm:py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg text-base sm:text-lg font-bold"
                  >
                    Place Order
                  </button>
                )}{/* Information text */}
                <p className="text-sm text-gray-600 text-center mt-3">
                  {!paymentStatus.isPaid ?
                    "Complete payment to place your order" :
                    "Click Place Order to confirm your order"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Recommended Items */}
        {suggestedItems.length > 0 && (
          <div className="px-4 sm:px-6 py-6 bg-red-50">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">You Might Also Like</h3>
            <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4">
              {suggestedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-40 sm:w-56 bg-white rounded-2xl shadow-lg p-3 sm:p-4 transform hover:scale-105 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-28 sm:h-40 object-cover rounded-xl mb-2 sm:mb-3 shadow-md"
                  />
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">{item.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-base sm:text-lg">₹{item.price}</span>
                    <button
                      onClick={() => handleAddItemToCart(item)}
                      className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-red-600 transition-all shadow-md text-sm sm:text-base"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Success Modal */}
      {paymentStatus.isPaid && orderStatus.placed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Transaction ID: {paymentStatus.transactionId}</p>
            <p className="text-gray-600 mb-4">Order Number: #{orderStatus.orderNumber}</p>
            <button
              onClick={() => {
                setOrderStatus({ placed: false, message: '', orderNumber: null });
                window.location.href = '/'; // Redirect to home page
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Integration Component */}
      <div className="fixed bottom-4 right-4">
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center space-x-2"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="hidden sm:inline">Need Help?</span>
        </a>
      </div>
    </div>
  );
};

export default Cart;