import React from 'react';

function Footer() {
  return (
    <footer className="bg-primary text-white dark:bg-[#000000] py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">WorkBuddy</h2>
          <p className="text-sm">
            Your trusted platform to hire skilled workers and service professionals across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>

        {/* For Workers */}
        <div>
          <h3 className="font-semibold text-lg mb-3">For Workers</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Register</a></li>
            <li><a href="#" className="hover:underline">View Requests</a></li>
            <li><a href="#" className="hover:underline">Profile</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <p className="text-sm mb-2"> Hyderabad, India</p>
          <p className="text-sm mb-2">+91 8074953805</p>
          <p className="text-sm">support@workbuddy.com</p>
        </div>
      </div>

      <div className="mt-10 text-center text-sm border-t border-white/20 pt-4">
        © {new Date().getFullYear()} WorkBuddy. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
