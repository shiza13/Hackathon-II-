'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          TaskFlow
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex space-x-4"
        >
          <Link href="/auth/login">
            <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all">
              Login
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all">
              Sign Up
            </button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold max-w-3xl leading-tight"
        >
          Transform Chaos Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Creative Flow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-xl text-gray-300 max-w-2xl"
        >
          The productivity app that thinks like you do. Organize, prioritize, and accomplish more with intuitive task management designed for creators and innovators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex space-x-4"
        >
          <Link href="/auth/signup">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20">
              Start Free Trial
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-lg font-semibold hover:bg-white/20 transition-all">
              Sign In
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Animated Task Preview Cards */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Smart Prioritization", desc: "AI-powered suggestions to focus on what matters most", icon: "🧠" },
            { title: "Collaboration Made Easy", desc: "Real-time sharing and team workflows", icon: "👥" },
            { title: "Focus Mode", desc: "Distraction-free zone to boost concentration", icon: "🎯" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Built for Modern Productivity</h2>
            <p className="text-xl text-gray-400">More than just a to-do list — it's your personal productivity ecosystem</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-3xl font-bold mb-4">Visual Task Management</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Drag-and-drop boards, custom labels, and visual progress tracking that makes planning feel effortless.
                See your workflow come alive in real-time.
              </p>
              <ul className="space-y-3">
                {[
                  "Customizable Kanban boards",
                  "Deadline tracking with smart alerts",
                  "Team collaboration tools",
                  "Cross-platform synchronization"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="mr-3 text-green-400">✓</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold">Today's Focus</h4>
                  <div className="text-sm text-gray-400">2 of 5 tasks</div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Complete project proposal", completed: true },
                    { title: "Team standup meeting", completed: true },
                    { title: "Research new tools", completed: false },
                    { title: "Prepare presentation", completed: false },
                    { title: "Weekly review", completed: false }
                  ].map((task, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border ${
                        task.completed
                          ? 'bg-green-900/20 border-green-500/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-400'
                        }`}>
                          {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.title}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center rounded-3xl p-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg border border-white/10"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of creators, entrepreneurs, and teams who have revolutionized their workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/signup">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-lg font-semibold hover:bg-white/20 transition-all">
                Sign In to Account
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}