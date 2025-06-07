"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, UploadCloud, Zap, Bot, Users, BarChart2, ShieldCheck,  Brain, Clock,  CheckCircle, QrCode, Database, Monitor , ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "What kind of data can I upload to train the AI?",
    answer: "You can upload various formats like PDFs, TXT files, CSVs containing FAQs, product descriptions, or any relevant business documentation. You can also provide website URLs for scraping.",
  },
  {
    question: "How does the AI handle context and follow-up questions?",
    answer: "Our AI uses advanced Large Language Models (LLMs) with sophisticated context window management. This allows it to understand conversational flow and respond accurately to follow-up questions based on the preceding dialogue and your provided data.",
  },
  {
    question: "Is my business data secure?",
    answer: "Absolutely. We prioritize data security using industry-standard encryption for data in transit and at rest. Access controls and regular security audits are in place to protect your information.",
  },
  {
    question: "How easy is it to integrate with my existing WhatsApp Business number?",
    answer: "Integration is straightforward. You'll scan a QR code to link your WhatsApp Business account. No complex API configurations are needed from your end to get started.",
  },
  {
    question: "Can I monitor and override the AI's conversations?",
    answer: "Yes, our platform provides a dashboard where you can monitor all AI conversations in real-time. You'll have the ability to step in and take over a chat if necessary.",
  },
  {
    question: "What happens if the AI doesn't know an answer?",
    answer: "The AI is trained to respond based on the data you provide. If it encounters a question outside its knowledge base, it can be configured to provide a polite 'I don't know' response, ask for clarification, or escalate the query to a human agent according to your preference.",
  },
];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            Turiq<span className="text-blue-400">AI</span>
          </div>
          <Link href="/auth">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
            Sign In with Google
          </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div 
            className="absolute w-64 h-64 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-2xl transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 pt-16">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Customer Support
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WhatsApp Into AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Create intelligent WhatsApp agents in minutes. Simply scan a QR code, upload your business data, 
            and watch AI handle customer conversations 24/7 with human-like precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
            <button className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center">
              Start Building Your AI Agent
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">3 min</div>
              <div className="text-gray-400 text-sm">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">0%</div>
              <div className="text-gray-400 text-sm">Coding Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Future of <span className="text-blue-400">Customer Support</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              TuriqAI bridges the gap between your business knowledge and customer needs through AI WhatsApp automation. 
              No technical expertise required.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI That Understands Your Business</h3>
                    <p className="text-gray-400">Upload your documents, FAQs, and product info. Our AI learns your business inside-out to provide accurate, contextual responses.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Seamless WhatsApp Integration</h3>
                    <p className="text-gray-400">Connect your existing WhatsApp Business account with a simple QR scan. Your customers chat normally while AI handles the heavy lifting.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Full Control & Monitoring</h3>
                    <p className="text-gray-400">Watch conversations in real-time, step in when needed, and continuously improve your AI agent's performance with our intuitive dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">WhatsApp Business Connected</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">Business Data Uploaded</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">AI Agent Active</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-black/50 rounded-lg">
                  <div className="text-green-400 text-sm font-mono">
                    ✓ Handling 847 conversations today<br />
                    ✓ 98.3% customer satisfaction<br />
                    ✓ 0 missed messages
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get Started in <span className="text-blue-400">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From zero to AI-powered customer support in under 5 minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: <QrCode className="w-8 h-8" />,
                  title: "Scan QR Code",
                  description: "Connect your WhatsApp Business account instantly with our secure QR code system. No technical setup required.",
                  color: "blue"
                },
                {
                  step: "02", 
                  icon: <UploadCloud className="w-8 h-8" />,
                  title: "Upload Business Data",
                  description: "Drag and drop your FAQs, product catalogs, policies, and any relevant documents. Our AI learns everything automatically.",
                  color: "purple"
                },
                {
                  step: "03",
                  icon: <Bot className="w-8 h-8" />,
                  title: "AI Goes Live",
                  description: "Your intelligent agent is now ready to handle customer queries 24/7 with your business knowledge built-in.",
                  color: "green"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                    activeStep === index 
                      ? `bg-${step.color}-600/10 border-${step.color}-500/50 scale-105` 
                      : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="absolute -top-4 left-8">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      activeStep === index 
                        ? `bg-${step.color}-500 text-white` 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {step.step}
                    </span>
                  </div>
                  
                  <div className={`mb-4 ${activeStep === index ? `text-${step.color}-400` : 'text-gray-400'}`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-blue-400">TuriqAI</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built for businesses who want powerful AI without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Clock className="w-8 h-8" />, 
                title: "24/7 Availability", 
                description: "Never miss a customer query. Your AI agent works around the clock, ensuring constant engagement and support.",
                gradient: "from-blue-500 to-cyan-500"
              },
              { 
                icon: <Brain className="w-8 h-8" />, 
                title: "Human-Like Intelligence", 
                description: "Advanced natural language processing ensures conversations feel natural and contextually appropriate.",
                gradient: "from-purple-500 to-pink-500"
              },
              { 
                icon: <ShieldCheck className="w-8 h-8" />, 
                title: "Enterprise Security", 
                description: "Bank-level encryption and security protocols protect your business data and customer conversations.",
                gradient: "from-green-500 to-emerald-500"
              },
              { 
                icon: <BarChart2 className="w-8 h-8" />, 
                title: "Real-Time Analytics", 
                description: "Track performance, customer satisfaction, and conversation insights with comprehensive dashboards.",
                gradient: "from-orange-500 to-red-500"
              },
              { 
                icon: <Users className="w-8 h-8" />, 
                title: "Seamless Handoff", 
                description: "Easily transition complex queries to human agents with full conversation context preserved.",
                gradient: "from-teal-500 to-blue-500"
              },
              { 
                icon: <Zap className="w-8 h-8" />, 
                title: "Instant Setup", 
                description: "Go from registration to live AI agent in minutes, not weeks. No technical expertise required.",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-600 transition-all duration-300 hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <span className="text-white">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about TuriqAI
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300">
                <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                  <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{faq.question}</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
            Join thousands of businesses already using AI to deliver exceptional customer experiences
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
            <button className="group bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
          </div>

          <div className="mt-12 text-blue-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              Turiq<span className="text-blue-400">AI</span>
            </div>
            <p className="text-gray-400 mb-6">
              &copy; 2025 TuriqAI. All rights reserved.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
                <Link href="/privacy-policy">
                <p  className="hover:text-blue-400 transition-colors">Privacy Policy</p>
                </Link>
              <Link href='/terms-service'>
               <p  className="hover:text-blue-400 transition-colors">Terms of Service</p>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}