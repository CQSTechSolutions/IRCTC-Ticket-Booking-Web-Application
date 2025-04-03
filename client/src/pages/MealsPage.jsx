import React, { useState } from 'react';
import { FaUtensils, FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';

const MealsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Meals' },
    { id: 'veg', name: 'Vegetarian' },
    { id: 'nonveg', name: 'Non-Vegetarian' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'beverages', name: 'Beverages' }
  ];

  const meals = [
    {
      id: 1,
      name: "Veg Thali",
      description: "Complete vegetarian meal with dal, sabzi, roti, and rice",
      price: "₹120",
      category: "veg",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      preparationTime: "15-20 mins"
    },
    {
      id: 2,
      name: "Chicken Biryani",
      description: "Fragrant basmati rice cooked with tender chicken pieces",
      price: "₹180",
      category: "nonveg",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a9f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      preparationTime: "20-25 mins"
    },
    {
      id: 3,
      name: "Samosa",
      description: "Crispy pastry filled with spiced potatoes and peas",
      price: "₹40",
      category: "snacks",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      preparationTime: "5-10 mins"
    },
    {
      id: 4,
      name: "Masala Chai",
      description: "Traditional Indian spiced tea with milk",
      price: "₹20",
      category: "beverages",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      preparationTime: "5-7 mins"
    }
  ];

  const filteredMeals = selectedCategory === 'all' 
    ? meals 
    : meals.filter(meal => meal.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Train Meals & Refreshments</h1>
          <p className="text-xl">Order delicious meals for your journey</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={meal.image} 
                alt={meal.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
                <p className="text-gray-600 mb-4">{meal.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span className="text-sm text-gray-600">{meal.preparationTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-semibold">{meal.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-green-600" />
                    <span className="text-xl font-bold">{meal.price}</span>
                  </div>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Instructions */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Your Meal</h3>
              <p className="text-gray-600">Browse through our menu and choose your preferred meal</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Train Details</h3>
              <p className="text-gray-600">Provide your PNR number and seat details</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Meal</h3>
              <p className="text-gray-600">Your meal will be delivered to your seat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealsPage;