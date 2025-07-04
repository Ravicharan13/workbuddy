import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I register as a worker?",
    answer: `To register as a worker, simply click the “Get Started” button on the homepage. 
    You'll be guided to a registration form where you can provide your personal details, skills, location, and availability. 
    After submitting, our verification team will review your profile before approval.`,
  },
  {
    question: "Is it free to use?",
    answer: `Yes, absolutely! Our platform is free for all users on the basic plan. 
    Workers can create profiles, respond to service requests, and get hired without any charges. 
    We do offer premium features for advanced analytics and promotion, but they're completely optional.`,
  },
  {
    question: "How are workers verified?",
    answer: `We ensure safety and quality by verifying every worker’s identity and skill set. 
    Workers must submit a valid ID proof, complete profile information, and may be asked to provide certification or past work samples. 
    Only verified workers can start accepting job requests.`,
  },
  {
    question: "How do I contact customer support?",
    answer: `You can reach our customer support team through the chat bubble available on every page, 
    or email us at support@workbuddy.com. We also provide 24/7 assistance via our mobile app help section.`,
  },
  {
    question: "Can I track my service requests?",
    answer: `Yes! You can track the status of your current and past service requests in the dashboard. 
    Each request includes real-time updates on worker assignment, estimated time of arrival, and job completion.`,
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800 px-6 md:px-20 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-900 shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left"
            >
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
