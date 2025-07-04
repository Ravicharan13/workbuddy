import React from 'react';
import {
  Smile,
  BadgeCheck,
  Hammer,
  Clock,
  Users,
} from 'lucide-react';

function Stats() {
  const stats = [
    {
      label: 'Happy Customers',
      value: '12K+',
      icon: <Smile className="w-8 h-8 text-pink-500 dark:text-pink-400 mb-2" />,
    },
    {
      label: 'Verified Workers',
      value: '5.2K',
      icon: <BadgeCheck className="w-8 h-8 text-green-500 dark:text-green-400 mb-2" />,
    },
    {
      label: 'Services Completed',
      value: '38K+',
      icon: <Hammer className="w-8 h-8 text-yellow-500 dark:text-yellow-400 mb-2" />,
    },
    {
      label: 'Avg. Response Time',
      value: '5 min',
      icon: <Clock className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />,
    },
    {
      label: 'Community Users',
      value: '20K+',
      icon: <Users className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-2" />,
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-6 md:px-32">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Our Growing Impact
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            {stat.icon}
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
