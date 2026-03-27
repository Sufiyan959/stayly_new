import React from 'react'

export default function About() {
  return (
    <section className="bg-gradient-to-r from-slate-50 to-indigo-50 py-20 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-6">
          About <span className="text-indigo-600">Stayly</span>
        </h1>

        <p className="text-center text-slate-500 mb-12 max-w-3xl mx-auto">
          Stayly is a modern real estate platform that helps people discover,
          list, and manage properties with clarity, trust, and ease.
        </p>

        {/* Content */}
        <div className="space-y-6 text-slate-700 leading-relaxed text-[16.5px]">
          <p>
            Stayly connects buyers, sellers, and renters through a clean and
            transparent real estate experience. We combine smart technology
            with market insights to help users find the right place faster.
          </p>

          <p>
            Our mission is to simplify property decisions by providing accurate
            listings, intuitive tools, and a seamless user experience. Whether
            you’re searching for a home or listing one, Stayly guides you every
            step of the way.
          </p>

          <p>
            Built with a people-first mindset, Stayly focuses on reliability,
            simplicity, and confidence. We believe real estate should feel
            exciting and stress-free—not complicated.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-indigo-50">
            <h3 className="text-3xl font-bold text-indigo-600">12K+</h3>
            <p className="text-slate-600 mt-1">Active Listings</p>
          </div>

          <div className="p-6 rounded-xl bg-indigo-50">
            <h3 className="text-3xl font-bold text-indigo-600">6K+</h3>
            <p className="text-slate-600 mt-1">Happy Users</p>
          </div>

          <div className="p-6 rounded-xl bg-indigo-50">
            <h3 className="text-3xl font-bold text-indigo-600">150+</h3>
            <p className="text-slate-600 mt-1">Verified Agents</p>
          </div>
        </div>

      </div>
    </section>
  );
}
