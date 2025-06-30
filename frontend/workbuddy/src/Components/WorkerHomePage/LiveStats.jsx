import React from 'react';
import { Briefcase, Users, Clock3, Star, MapPin, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    icon: <CheckCircle2 className="text-green-500 w-6 h-6" />,
    label: "Jobs Completed",
    value: "12,000+",
  },
  {
    icon: <Users className="text-blue-500 w-6 h-6" />,
    label: "Registered Workers",
    value: "6,500+",
  },
  {
    icon: <Clock3 className="text-yellow-500 w-6 h-6" />,
    label: "Avg. Response Time",
    value: "3 hrs",
  },
  {
    icon: <Star className="text-orange-500 w-6 h-6" />,
    label: "Average Rating",
    value: "4.9/5",
  },
  {
    icon: <MapPin className="text-purple-500 w-6 h-6" />,
    label: "Cities Covered",
    value: "20+",
  },
  {
    icon: <Briefcase className="text-pink-500 w-6 h-6" />,
    label: "Active Clients",
    value: "1,200+",
  },
];

function LiveStats() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Platform Live Stats
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {stat.icon}
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveStats;
