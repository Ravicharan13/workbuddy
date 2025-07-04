import React from 'react';
import {
  Wrench,
  Zap,
  BookOpen,
  Paintbrush,
  Brush,
  Hammer,
  Code,
  Truck,
  Wind,
  Sofa,
} from 'lucide-react';


const services = [
  { icon: <Wrench className="w-8 h-8 text-blue-600" />, name: 'Plumbing' },
  { icon: <Zap className="w-8 h-8 text-yellow-500" />, name: 'Electrician' },
  { icon: <BookOpen className="w-8 h-8 text-green-600" />, name: 'Tutor' },
  { icon: <Paintbrush className="w-8 h-8 text-purple-500" />, name: 'Designer' },
  { icon: <Brush className="w-8 h-8 text-pink-600" />, name: 'Cleaner' },
  { icon: <Hammer className="w-8 h-8 text-orange-500" />, name: 'Carpenter' },
  { icon: <Code className="w-8 h-8 text-indigo-600" />, name: 'Developer' },
  { icon: <Truck className="w-8 h-8 text-teal-500" />, name: 'Delivery' },
  { icon: <Wind className="w-8 h-8 text-blue-500" />, name: 'AC Service' },
  { icon: <Sofa className="w-8 h-8 text-gray-700" />, name: 'Furniture' },
];

function ServiceCategories() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Services We Offer
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {service.icon}
            <p className="mt-4 text-sm font-medium text-gray-800 dark:text-white">{service.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceCategories;
