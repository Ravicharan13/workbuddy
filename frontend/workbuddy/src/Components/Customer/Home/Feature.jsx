import React from 'react';
import { Search, MessageSquare, CheckCircle } from 'lucide-react';

function Feature() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-gray-700 dark:text-gray-50" />,
      title: "Browse Services",
      description: "Easily discover skilled professionals for your needs.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-gray-700 dark:text-gray-50" />,
      title: "Chat Instantly",
      description: "Connect and communicate with workers in real-time.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-gray-700 dark:text-gray-50" />,
      title: "Track Progress",
      description: "Monitor service status and completion updates.",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6 md:px-32">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        What You Can Do
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center w-full md:w-1/3 px-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-5 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Feature ;
