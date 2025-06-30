import React from 'react';
import { MapPin, Clock, IndianRupee } from 'lucide-react';

const jobs = [
  {
    title: "Fix Bathroom Leak",
    location: "Hyderabad",
    budget: 1200,
    timePosted: "2 hours ago",
  },
  {
    title: "Install Ceiling Fan",
    location: "Bengaluru",
    budget: 800,
    timePosted: "4 hours ago",
  },
  {
    title: "Home Tutoring - Class 10",
    location: "Mumbai",
    budget: 5000,
    timePosted: "Today, 9:00 AM",
  },
  {
    title: "Design Business Logo",
    location: "Delhi",
    budget: 3000,
    timePosted: "Yesterday, 5:45 PM",
  },
  {
    title: "Repair Kitchen Sink",
    location: "Chennai",
    budget: 1000,
    timePosted: "1 day ago",
  },
];

function LatestJobFeed() {
  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Latest Job Requests
        </h2>

        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  {job.title}
                </h3>
                <span className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                  <IndianRupee size={16} className="mr-1" /> {job.budget}
                </span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {job.timePosted}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestJobFeed;
