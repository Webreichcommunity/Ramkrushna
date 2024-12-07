import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useCart } from '../context/CartContext';

const MainHeader = () => {
    const { cartItems } = useCart();

    return (
        <>
            <header className="bg-green-100 text-black p-3 flex justify-between items-center shadow-lg sticky top-0 z-50">
                {/* sticky top-0 z-50 */}
                <div className="flex items-center space-x-4">
                    <div className="bg-opacity-35 rounded-md flex items-center">
                        <div className="animate-location-icon">
                            {/* <MdLocationOn className="h-6 w-6 text-green-600" /> */}
                        </div>
                        <div className="ml-2 font-bold text-gray-700">
                            <h2 className="text-lg leading-tight">Ram Krushana <span className="text-green-600">Nursery</span></h2>
                            <h4 className="text-xs text-gray-500">Landscape & Garden Developer</h4>
                            
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-2 content-center">
                    <Link
                        to="/cart"
                        className="relative flex items-center hover:text-green-600 transition-colors duration-200 opacity-80"
                    >
                        <span className="text-xl">🛒</span>
                        {cartItems.length > 0 && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-600 text-white w-4 h-4 text-xs rounded-full flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            <style jsx>{`
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes jump {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes colorChange {
                    0% { color: green; }
                    50% { color: lime; }
                    100% { color: green; }
                }
                .animate-location-icon {
                    animation: rotate 1.5s linear infinite, jump 1.5s ease-in-out infinite, colorChange 4s linear infinite;
                }
            `}</style>
        </>
    );
};

export default MainHeader;