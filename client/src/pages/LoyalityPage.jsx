import React from 'react';
import { FaStar, FaGift, FaPercent, FaTicketAlt, FaHotel, FaUtensils } from 'react-icons/fa';

const LoyalityPage = () => {
  const tiers = [
    {
      name: "Silver",
      points: "0-1000",
      color: "bg-gray-400",
      benefits: [
        "5% points on train bookings",
        "Basic customer support",
        "Standard check-in"
      ]
    },
    {
      name: "Gold",
      points: "1001-5000",
      color: "bg-yellow-500",
      benefits: [
        "10% points on train bookings",
        "Priority customer support",
        "Express check-in",
        "Free meal on long journeys"
      ]
    },
    {
      name: "Platinum",
      points: "5001+",
      color: "bg-purple-500",
      benefits: [
        "15% points on train bookings",
        "24/7 VIP customer support",
        "Lounge access",
        "Free meals on all journeys",
        "Upgrade to higher class when available"
      ]
    }
  ];

  const rewards = [
    {
      id: 1,
      title: "Train Tickets",
      description: "Redeem points for free train tickets",
      icon: <FaTicketAlt className="text-4xl text-blue-600" />,
      points: "1000 points"
    },
    {
      id: 2,
      title: "Hotel Stays",
      description: "Get discounts on hotel bookings",
      icon: <FaHotel className="text-4xl text-green-600" />,
      points: "2000 points"
    },
    {
      id: 3,
      title: "Meal Orders",
      description: "Free meals during your journey",
      icon: <FaUtensils className="text-4xl text-orange-600" />,
      points: "500 points"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">IRCTC Rewards Program</h1>
          <p className="text-xl">Earn points on every journey, redeem for amazing rewards</p>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${tier.color} text-white p-6 text-center`}>
                <FaStar className="text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-sm opacity-75">{tier.points} points</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <FaGift className="text-green-500 mr-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                  Upgrade Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">{reward.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
                <p className="text-gray-600 mb-4">{reward.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <FaPercent className="text-green-500" />
                  <span className="font-semibold">{reward.points}</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Trains</h3>
            <p className="text-gray-600">Book your train tickets through IRCTC</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
            <p className="text-gray-600">Get points based on your booking amount</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
            <p className="text-gray-600">Use points to get free tickets and more</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Benefits</h3>
            <p className="text-gray-600">Unlock exclusive benefits as you level up</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyalityPage;