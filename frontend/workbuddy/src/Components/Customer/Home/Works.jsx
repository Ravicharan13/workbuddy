import React from 'react';
import { Search, ClipboardCheck, Smile } from 'lucide-react';

function Works() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary dark:text-white" />,
      title: "Find a Service",
      description: "Browse categories and filter services that fit your needs.",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-primary dark:text-white" />,
      title: "Book Instantly",
      description: "Send requests and confirm bookings in just a few clicks.",
    },
    {
      icon: <Smile className="w-8 h-8 text-primary dark:text-white" />,
      title: "Get It Done",
      description: "Sit back and relax while your task is completed reliably.",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-32">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        How It Works
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center w-full md:w-1/3 px-4">
            <div className="bg-blue-100 dark:bg-gray-700 rounded-full p-5 mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Works;
