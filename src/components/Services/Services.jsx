import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

const plantsData = [
    { name: 'Outdoor Plants', imgSrc: 'http://www.nisarganursery.com/images/plant/indoor.jpg' },
    { name: 'Lawn Development', imgSrc: 'http://www.nisarganursery.com/images/plant/BlanketFlower.png' },
    { name: 'Indoor Plants', imgSrc: 'http://www.nisarganursery.com/images/plant/orange.jpg' },
    { name: 'Garden Maintenance', imgSrc: 'http://www.nisarganursery.com/images/plant/Spices.jpg' },
    { name: 'Flower Plants', imgSrc: 'http://www.nisarganursery.com/images/plant/Ficus.jpg' },
    { name: 'Landscape Design', imgSrc: 'http://www.nisarganursery.com/images/plant/Ground.jpg' },
    { name: 'Fruit Plants', imgSrc: 'http://www.nisarganursery.com/images/Bamboo%20Plants.jpg' },
    { name: 'Vertical Wall Garden', imgSrc: 'http://www.nisarganursery.com/images/Spices_Plants.jpg' },
    { name: 'Show Plants', imgSrc: 'http://www.nisarganursery.com/images/plant/Aquatic.jpg' },
    { name: 'Organic Kitchen Garden', imgSrc: 'http://www.nisarganursery.com/images/plant/forest.jpg' },
    { name: 'Terrace Garden', imgSrc: 'http://www.nisarganursery.com/images/plant/avanue.jpg' },
    { name: 'Gifting Pot', imgSrc: 'http://www.nisarganursery.com/images/plant/medicinal.jpg' },
  ];
  

const Services = () => {

  return (
    <section className="py-8 rounded-lg px-8">
      <div className="mb-4 flex max-w-max items-center space-x-2 rounded-full border p-2 bg-green-50">
        <p className="text-xs font-medium md:text-sm">
          Learn More About Us
          <span className="ml-2 cursor-pointer font-bold">Explore Now &rarr;</span>
        </p>
      </div>

      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-left mb-10 text-green-800">Landscape & Garden Developer</h2>

        {/* Horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-200 rounded scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="flex space-x-4">
            {plantsData.map((plant, index) => (
              <div
                key={index}
                className="min-w-[250px] sm:min-w-[300px] bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={plant.imgSrc}
                  alt={plant.name}
                  className="w-full h-48 object-cover"
                />
                {/* Text below plant card */}
                <div className="p-4">
                  <h3 className="text-green-700 text-lg font-semibold">{plant.name}</h3>
                  <p className="text-md text-gray-600 mt-2">Explore {plant.name} in detail.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;