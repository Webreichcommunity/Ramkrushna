import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa';
import foodItemsData from '../../../db.json';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';

// Plant Detail Modal Component
const PlantModal = ({ plant, isOpen, onClose, onAddToCart, onRemoveFromCart, quantity }) => {
  if (!isOpen) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* Modal content */}
      <div className="bg-white rounded-xl w-full max-w-3xl relative overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Plant image */}
          <div className="md:w-1/2">
            <img 
              src={plant.image} 
              alt={plant.name}
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </div>

          {/* Plant details */}
          <div className="md:w-1/2 p-6">
            <h2 className="text-2xl font-bold mb-2">{plant.name}</h2>
            
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {plant.tag && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  #{plant.tag}
                </span>
              )}
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {plant.subCategory}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">{plant.description}</p>

            {/* Price */}
            <div className="mb-6">
              {plant.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600">₹{plant.discountPrice}</span>
                  <span className="text-xl line-through text-gray-400">₹{plant.price}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-green-600">₹{plant.price}</span>
              )}
            </div>

            {/* Add to cart buttons */}
            <div className="flex items-center gap-4">
              {quantity > 0 ? (
                <div className="flex items-center gap-4 bg-green-50 p-2 rounded-lg">
                  <button onClick={() => onRemoveFromCart(plant)}>
                    <FaMinus size={20} />
                  </button>
                  <span className="text-xl font-bold">{quantity}</span>
                  <button onClick={() => onAddToCart(plant)}>
                    <FaPlus size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(plant)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Body Component
const Body = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  
  // Hooks
  const { addToCart, cartItems, updateItemQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // Get data
  const plants = foodItemsData.foodItems || [];
  const categories = [...new Set(plants.map(item => item.category))];
  const subCategories = [...new Set(plants.map(item => item.subCategory))];

  // Offer cards data
  const offerCards = [
    {
      title: 'Green Delight Offers!',
      description: 'Get up to 40% OFF on indoor plants!',
      bg: 'bg-gradient-to-r from-green-500 to-lime-500'
    },
    {
      title: 'Weekend Plant Fest!',
      description: '25% OFF on orders above ₹300!',
      bg: 'bg-gradient-to-r from-teal-400 to-green-600'
    },
    // Add more offers as needed
  ];

  // Change offer every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex(prev => (prev + 1) % offerCards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter plants based on search and category
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery) ||
                         plant.category.toLowerCase().includes(searchQuery) ||
                         plant.subCategory.toLowerCase().includes(searchQuery);
    const matchesFilter = !filter || plant.category === filter || plant.subCategory === filter;
    return matchesSearch && matchesFilter;
  });

  // Cart functions
  const handleAddToCart = (plant) => {
    addToCart(plant);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1000);
  };

  const handleRemoveFromCart = (plant) => {
    const cartItem = cartItems.find(item => item.id === plant.id);
    if (cartItem?.quantity > 1) {
      updateItemQuantity(plant.id, cartItem.quantity - 1);
    } else {
      removeItem(plant.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center bg-white rounded-full shadow-md p-3">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full px-4 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto mb-6 p-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-full ${!filter ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full ${
              filter === category ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Offers carousel */}
      <div className="mb-6 h-40 relative overflow-hidden rounded-lg">
        <AnimatePresence>
          {offerCards.map((offer, index) => (
            index === currentOfferIndex && (
              <motion.div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center text-white p-4 ${offer.bg}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
                <p>{offer.description}</p>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Plants grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlants.map(plant => {
          const cartItem = cartItems.find(item => item.id === plant.id);
          const quantity = cartItem?.quantity || 0;

          return (
            <div
              key={plant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedPlant(plant)}
            >
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">{plant.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">₹{plant.price}</span>
                  {quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCart(plant);
                        }}
                        className="p-1"
                      >
                        <FaMinus />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(plant);
                        }}
                        className="p-1"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(plant);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plant detail modal */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          quantity={cartItems.find(item => item.id === selectedPlant.id)?.quantity || 0}
        />
      )}

      {/* Added to cart popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed top-4 right-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert severity="success">Added to cart!</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart button */}
      <button
        onClick={() => navigate('/cart')}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg"
      >
        <FaShoppingCart size={24} />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>
    </div>
  );
};

export default Body;