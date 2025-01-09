import React from 'react';
import { MailIcon } from '@heroicons/react/outline';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-50 text-green-900 py-10 px-4 border-t border-green-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Ramkrishana <span className='text-green-600'>Nursery</span></h2>
          <p className="mb-2">Your trusted source for quality plants and gardening solutions.</p>
          <p className="mb-1">Motwani farm near Dream city, Barshitakli Road, Kanheri Sarap</p>
          <p className="mb-1">Phone: 8975330854</p>
        </div>
        <div className="flex space-x-6 mb-2 md:mb-0">
          <a
            href="https://www.instagram.com/ramkrishnanursery/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-900 hover:text-green-600 transition-transform transform hover:scale-125 duration-300"
          >
            <FaInstagram className="h-7 w-7" />
          </a>
          <a
            href="https://www.facebook.com/RamkrishnaNursery21/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-900 hover:text-green-600 transition-transform transform hover:scale-125 duration-300"
          >
            <FaFacebook className="h-7 w-7" />
          </a>
          <a
            href="https://wa.me/8975330854"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-900 hover:text-green-600 transition-transform transform hover:scale-125 duration-300"
          >
            <FaWhatsapp className="h-7 w-7" />
          </a>
          <a
            href="mailto:ramkrishananursery21@gmail.com"
            className="text-green-900 hover:text-green-600 transition-transform transform hover:scale-125 duration-300"
          >
            <MailIcon className="h-7 w-7" />
          </a>
        </div>
      </div>
      <div className="mt-2 text-center text-green-700">
        <p>&copy; {new Date().getFullYear()} Ramkrishna Nursery. All rights reserved.</p>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        footer {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
