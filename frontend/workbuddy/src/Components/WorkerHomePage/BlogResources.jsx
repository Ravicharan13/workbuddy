import React from 'react';

const posts = [
  {
    title: "5 Ways to Get More Jobs",
    excerpt: "Simple, proven techniques to boost your chances of landing more work on the platform.",
    author: "Admin",
    date: "June 25, 2025",
  },
  {
    title: "How to Stand Out as a Worker",
    excerpt: "Learn how to highlight your skills and get hired faster by optimizing your profile.",
    author: "Support Team",
    date: "June 20, 2025",
  },
  {
    title: "Top Skills in Demand This Month",
    excerpt: "Check which services are trending and how to level up your offerings.",
    author: "Analytics Team",
    date: "June 15, 2025",
  },
  {
    title: "How to Write a Great Service Description",
    excerpt: "Tips to write clear, attractive descriptions that make clients click 'Request Now'.",
    author: "Content Team",
    date: "June 10, 2025",
  },
];

function BlogResources() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Learning Resources
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                By {post.author} • {post.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogResources;
