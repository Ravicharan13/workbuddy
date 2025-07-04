import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FAQ() {
  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        "Booking a service is simple. Just sign in to your account, choose the category of service you need (e.g., electrician, plumber), and browse available professionals in your area. Click 'Send Request' to initiate. The service provider will receive a notification and respond to confirm availability.",
    },
    {
      question: "Can I chat with the service provider?",
      answer:
        "Absolutely. Once your service request is accepted, a secure real-time chat window will open. You can use this to discuss requirements, timing, location, or any special instructions directly with the professional—no third-party interference.",
    },
    {
      question: "How is payment handled?",
      answer:
        "We offer flexibility in payment methods. You can choose to pay online via UPI, debit/credit card, or mobile wallet once the job is complete. Alternatively, you can opt for cash payments directly to the worker. All transactions are securely logged for transparency.",
    },
    {
      question: "Are all service providers verified?",
      answer:
        "Yes. Every professional on our platform goes through a strict background verification process, including ID checks, experience validation, and behavior screening. Verified workers are clearly marked so customers can hire with confidence.",
    },
    {
      question: "What if I'm not satisfied with a service?",
      answer:
        "Customer satisfaction is our priority. If you're unhappy with a completed job, you can report the issue within the app. Our support team will investigate and mediate between you and the service provider to ensure a fair resolution. Refunds or reassignments are handled promptly when applicable.",
    },
    {
      question: "Can I reschedule or cancel a booking?",
      answer:
        "Yes, you can reschedule or cancel a booking directly from your dashboard before the service begins. We recommend doing so at least 1 hour in advance. Frequent cancellations without reason may affect your priority rating.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 px-6 md:px-32">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Frequently Asked Questions
      </h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-md p-5 bg-white dark:bg-gray-900 shadow-sm"
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

export default FAQ;
