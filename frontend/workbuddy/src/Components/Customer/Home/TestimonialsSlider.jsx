import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Anjali Sharma",
    feedback: "Found a reliable electrician within minutes! So convenient and professional.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    feedback: "Simple booking, fast response, and great service delivery. Loved it!",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 4,
  },
  {
    name: "Priya Desai",
    feedback: "The chat feature made it so easy to explain what I needed. Amazing app!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
  },
  {
    name: "Vikas Kumar",
    feedback: "Booking a worker was quicker than ordering food. Super intuitive!",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 4,
  },
  {
    name: "Neha Joshi",
    feedback: "Service history and support in one place. Clean and secure experience.",
    avatar: "https://randomuser.me/api/portraits/women/72.jpg",
    rating: 5,
  },
];

function TestimonialsSlider() {
  const [index, setIndex] = useState(0);



  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-6 md:px-32">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        What Our Customers Say
      </h2>

      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6">
        {/* Testimonial Card */}
        <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-6 text-center w-full md:w-[500px] duration-300">
          <img
            src={testimonials[index].avatar}
            alt={testimonials[index].name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-700 dark:text-gray-300 italic">"{testimonials[index].feedback}"</p>
          <div className="text-yellow-400 mt-3 text-lg">
            {"★".repeat(testimonials[index].rating)}{"☆".repeat(5 - testimonials[index].rating)}
          </div>
          <h4 className="mt-3 font-semibold text-gray-900 dark:text-white">{testimonials[index].name}</h4>
        </div>


        {/* Dots */}
        <div className="flex justify-center space-x-2 mt-2">
          {testimonials.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                i === index ? 'bg-gray-800 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSlider ;
