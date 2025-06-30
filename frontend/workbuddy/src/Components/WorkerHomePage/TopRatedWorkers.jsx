import React from 'react';
import { Star } from 'lucide-react';

const workers = [
  {
    name: "Riya Sharma",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    rating: 5,
    skills: ["Plumber", "Repair", "Maintenance"],
    location: "Hyderabad",
  },
  {
    name: "Arjun Mehta",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
    rating: 4,
    skills: ["Electrician", "Wiring", "AC Repair"],
    location: "Bengaluru",
  },
  {
    name: "Meena Kaur",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140027.png",
    rating: 5,
    skills: ["Tutor", "Maths", "Physics"],
    location: "Delhi",
  },
  {
    name: "Karan Verma",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140017.png",
    rating: 4,
    skills: ["Graphic Designer", "UI/UX", "Figma"],
    location: "Mumbai",
  },
];

function TopRatedWorkers() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Top Rated Workers
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {workers.map((worker, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow hover:shadow-md transition"
          >
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">
              {worker.name}
            </h3>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < worker.rating ? "#facc15" : "none"}
                  stroke="#facc15"
                  className="mr-1"
                />
              ))}
            </div>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
              {worker.location}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {worker.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 dark:bg-gray-700 text-primary dark:text-gray-50 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopRatedWorkers;
