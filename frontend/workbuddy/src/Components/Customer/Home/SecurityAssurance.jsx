import React from 'react';
import { ShieldCheck, Lock, Verified, EyeOff, UserCheck } from 'lucide-react';

function SecurityAssurance() {
  const assurances = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      bg: 'bg-blue-600',
      title: 'Verified Workers',
      desc: 'Every service provider is thoroughly background-checked.',
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      bg: 'bg-green-600',
      title: 'Secure Data',
      desc: 'We use top-tier encryption to protect your information.',
    },
    {
      icon: <Verified className="w-6 h-6 text-white" />,
      bg: 'bg-purple-600',
      title: 'Quality Assurance',
      desc: 'Strict quality checks ensure service excellence.',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-white" />,
      bg: 'bg-red-500',
      title: 'Privacy Protection',
      desc: 'Your personal details are never shared without consent.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-white" />,
      bg: 'bg-yellow-500',
      title: 'Trusted Community',
      desc: 'We cultivate a safe and reliable customer-worker ecosystem.',
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 px-6 md:px-32">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
        Your Safety is Our Priority
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
        {assurances.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center shadow-md mb-4`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 px-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SecurityAssurance;
