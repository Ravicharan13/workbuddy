import React from 'react';
import { User, CheckSquare, DollarSign } from 'lucide-react';

function HowItWorks() {
  const steps = [
    {
      icon: <User className="w-10 h-10 text-primary dark:text-gray-50" />,
      title: "Create Your Profile",
      description: "Highlight your skills and experience for customers"
    },
    {
      icon: <CheckSquare className="w-10 h-10 text-primary dark:text-gray-50" />,
      title: "Accept Job Requests",
      description: "View, accept, or decline job requests in one place"
    },
    {
      icon: <DollarSign className="w-10 h-10 text-primary dark:text-gray-50" />,
      title: "Track and Get Paid",
      description: "See job progression and manage your payments"
    }
  ];

  return (
    <section className=" bg-white py-12 px-6 md:px-32 dark:bg-gray-900 " >
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        How It Works
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-4">
            <div className="bg-blue-100 dark:bg-gray-700 dark:text-white rounded-full p-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {step.title}
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
