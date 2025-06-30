import React, { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Riya Sharma',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
    quote: '“Using this platform, I quickly filled my schedule with new jobs.”',
  },
  {
    name: 'Arjun Mehta',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png',
    quote: '“The request management system made it easy to stay organized.”',
  },
  {
    name: 'Priya Nair',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140061.png',
    quote: '“Super simple to use and saved me a ton of time.”',
  },
  {
    name: 'Ravi Patel',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',
    quote: '“Loved how smooth the request handling process was!”',
  },
  {
    name: 'Meena Kaur',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140027.png',
    quote: '“This platform boosted my visibility and helped me get hired faster.”',
  },
  {
    name: 'Karan Verma',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140017.png',
    quote: '“The system is reliable, and the interface is user-friendly.”',
  },
];

function TestimonialSlider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000); // 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Testimonials
      </h2>

      <div className="flex justify-center items-center space-x-6 max-w-4xl mx-auto">
        {/* Prev Button */}
        <button onClick={prev} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow">
          ←
        </button>

        {/* Testimonial Card */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full h-[250px] md:h-[200px] md:w-[500px] text-center shadow transition duration-500 ease-in-out">
          <img
            src={testimonials[index].avatar}
            alt={testimonials[index].name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-800 dark:text-gray-100 text-lg font-medium mb-2">
            {testimonials[index].quote}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">{testimonials[index].name}</span>
        </div>

        {/* Next Button */}
        <button onClick={next} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow">
          →
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              i === index ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default TestimonialSlider;

