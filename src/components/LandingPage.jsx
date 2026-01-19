import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Feather,
  Flower,
  Heart,
  Leaf,
  Sparkles,
  Star,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Book,
  Plus,
  Check,
  Coffee,
  Sun
} from 'lucide-react';

const AnimatedExplainer = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Add Your Children",
      description: "Create profiles for each child with their own color and curriculum",
      highlight: "sidebar"
    },
    {
      title: "Set Up Rhythms",
      description: "Organize your day into flexible time blocks that fit your family",
      highlight: "rhythms"
    },
    {
      title: "Plan Today's Tasks",
      description: "Assign lessons to each rhythm - short lessons keep attention fresh",
      highlight: "tasks"
    },
    {
      title: "Track & Complete",
      description: "Check off tasks as you go - watch your progress grow",
      highlight: "complete"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const students = [
    { name: 'Emma', color: 'bg-green-100 text-green-700', initial: 'E' },
    { name: 'Jack', color: 'bg-blue-100 text-blue-700', initial: 'J' },
    { name: 'Lily', color: 'bg-pink-100 text-pink-700', initial: 'L' }
  ];

  const rhythms = [
    { name: 'Morning Basket', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
    { name: 'Academic Block', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { name: 'Nature Study', icon: Leaf, color: 'bg-green-100 text-green-600' }
  ];

  const tasks = [
    { subject: 'HYMN', title: 'Amazing Grace - verse 2', time: '10m', completed: step === 3 },
    { subject: 'MATH', title: 'Exercise 14: Fractions', time: '20m', completed: step === 3 },
    { subject: 'READING', title: 'Robinson Crusoe ch. 5', time: '20m', completed: false },
    { subject: 'NATURE', title: 'Sketch: Oak leaf study', time: '15m', completed: false }
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? 'bg-stone-800 w-8' : 'bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* Step Title */}
      <div className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
        <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">{steps[step].title}</h3>
        <p className="text-stone-600 text-sm">{steps[step].description}</p>
      </div>

      {/* Mock App Interface */}
      <div className={`bg-[#FDFBF7] rounded-xl overflow-hidden shadow-2xl border border-[#E8E4D9] flex flex-col md:flex-row h-[420px] transition-all duration-300 ${isAnimating ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        {/* Sidebar - Students */}
        <div className={`hidden md:flex w-20 bg-[#F6F4EE] border-r border-[#E8E4D9] flex-col items-center py-6 gap-4 transition-all duration-500 ${step === 0 ? 'ring-2 ring-[#A9B388] ring-inset' : ''}`}>
          <div className="w-10 h-10 bg-[#5F6F52] rounded-lg flex items-center justify-center text-white shadow-md">
            <Flower size={20} />
          </div>
          <div className="w-full h-px bg-[#E8E4D9]" />
          {students.map((student, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full ${student.color} flex items-center justify-center font-serif text-sm font-bold shadow-sm transition-all duration-500 ${
                step === 0 ? 'animate-pulse' : ''
              } ${step === 0 && i === students.length - 1 ? 'ring-2 ring-[#5F6F52] ring-offset-2' : ''}`}
            >
              {student.initial}
            </div>
          ))}
          {step === 0 && (
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#A9B388] flex items-center justify-center text-[#A9B388] animate-pulse">
              <Plus size={16} />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-5 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#2F3E32] font-bold">Today's Schedule</h3>
              <p className="text-xs text-stone-500">Emma • Monday, January 19</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#5F6F52] bg-[#A9B388]/20 px-2 py-1 rounded-full">
                {step === 3 ? '2' : '0'}/4 done
              </span>
            </div>
          </div>

          {/* Rhythms Section */}
          <div className={`mb-4 transition-all duration-500 ${step === 1 ? 'ring-2 ring-[#A9B388] rounded-lg p-2 -m-2' : ''}`}>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Rhythms</p>
            <div className="flex gap-2 flex-wrap">
              {rhythms.map((rhythm, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
                    step === 1 && i === 0 ? 'border-[#5F6F52] bg-white shadow-md scale-105' : 'border-[#E8E4D9] bg-[#FDFBF7]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md ${rhythm.color} flex items-center justify-center`}>
                    <rhythm.icon size={14} />
                  </div>
                  <span className="text-xs font-medium text-[#2F3E32]">{rhythm.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className={`flex-1 overflow-hidden transition-all duration-500 ${step === 2 || step === 3 ? 'ring-2 ring-[#A9B388] rounded-lg p-2 -m-2' : ''}`}>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Tasks</p>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className={`p-3 bg-white border rounded-lg transition-all duration-500 ${
                    task.completed ? 'border-[#A9B388] bg-[#A9B388]/10' : 'border-[#E8E4D9]'
                  } ${step === 2 && i === 0 ? 'shadow-md scale-[1.02] border-[#5F6F52]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-[#A9B388] uppercase tracking-widest">{task.subject}</span>
                    <span className="text-[10px] text-stone-400">{task.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      task.completed
                        ? 'border-[#5F6F52] bg-[#5F6F52] text-white'
                        : 'border-[#E8E4D9]'
                    } ${step === 3 && i < 2 ? 'animate-bounce' : ''}`}>
                      {task.completed && <Check size={12} />}
                    </div>
                    <p className={`font-serif text-sm transition-all duration-300 ${task.completed ? 'text-stone-400 line-through' : 'text-[#2F3E32]'}`}>
                      {task.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Progress */}
        <div className="hidden lg:flex w-48 bg-white border-l border-[#E8E4D9] p-4 flex-col">
          <h4 className="font-serif text-sm font-bold text-[#2F3E32] mb-3">This Week</h4>

          {/* Mini Progress Bars */}
          <div className="space-y-3 flex-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={day} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className={`font-medium ${i === 0 ? 'text-[#5F6F52]' : 'text-stone-400'}`}>{day}</span>
                  <span className="text-stone-400">{i === 0 ? (step === 3 ? '50%' : '0%') : i < 3 ? '100%' : '—'}</span>
                </div>
                <div className="h-1.5 bg-[#E8E4D9] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-[#A9B388] rounded-full transition-all duration-1000 ${
                      i === 0 && step === 3 ? 'w-1/2' : i === 0 ? 'w-0' : i < 3 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E4D9] mt-auto">
            <p className="text-[10px] text-stone-500 mb-1">Week Progress</p>
            <p className="text-lg font-serif font-bold text-[#5F6F52]">{step === 3 ? '62%' : '60%'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setStep((prev) => (prev - 1 + steps.length) % steps.length)}
          className="p-2 rounded-full hover:bg-[#E8E4D9] transition-colors"
        >
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
        <button
          onClick={() => setStep((prev) => (prev + 1) % steps.length)}
          className="p-2 rounded-full hover:bg-[#E8E4D9] transition-colors"
        >
          <ChevronRight size={20} className="text-stone-600" />
        </button>
      </div>
    </div>
  );
};

const LegalModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-stone-200">
          <h2 className="text-2xl font-serif font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <span className="text-2xl text-stone-400">&times;</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-stone max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onGetStarted }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-stone-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                <Feather className="text-[#FDFCF8]" size={18} />
              </div>
              <span className="text-xl font-serif font-bold text-stone-800">Kairos Planner</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-stone-600 hover:text-stone-900 font-medium">Features</a>
              <a href="#philosophy" className="text-stone-600 hover:text-stone-900 font-medium">Philosophy</a>
              <a href="#pricing" className="text-stone-600 hover:text-stone-900 font-medium">Pricing</a>
              <button 
                onClick={onGetStarted}
                className="text-stone-600 hover:text-stone-900 font-medium"
              >
                Log in
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-stone-800 text-[#FDFCF8] px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-10 pointer-events-none">
           <div className="absolute top-20 left-20 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
           <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Bring Peace to Your <br/>
              <span className="text-stone-600 italic">Homeschool</span> Days
            </h1>
            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              Move from chaos to kairos. A beautiful planner designed for intentional homeschool families who value rhythms, habits, and rich learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-[#FDFCF8] rounded-xl hover:bg-stone-700 transition-all transform hover:scale-105 font-medium text-lg flex items-center justify-center gap-2 shadow-lg shadow-stone-200"
              >
                Start Your Free Trial <ArrowRight size={18} />
              </button>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E8E4D9] text-stone-700 rounded-xl hover:bg-[#FDFCF8] transition-colors font-medium text-lg text-center"
              >
                View Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-stone-500">No credit card required for trial • Cancel anytime</p>
          </div>

          {/* App Preview - Animated Explainer */}
          <div id="demo" className="mt-16 relative mx-auto max-w-5xl px-2 sm:px-0 scroll-mt-24">
             <AnimatedExplainer />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Designed for Intentional Learning</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Standard planners don't understand how homeschools actually work. Kairos does.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="text-amber-600" />,
                title: "Pick Up Where You Left Off",
                desc: "Forget rigid dates. Our flexible system keeps your place in books and resources, so you never fall 'behind'—you just keep going."
              },
              {
                icon: <Users className="text-green-600" />,
                title: "Family Learning",
                desc: "Easily manage Morning Time and combined subjects. Plan once for the whole family, track progress for each child."
              },
              {
                icon: <CheckCircle className="text-blue-600" />,
                title: "Habit Training",
                desc: "Integrated habit tracking allows you to focus on character alongside curriculum. Gentle reminders for gentle formation."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#FDFCF8] border border-[#E8E4D9] hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl border border-[#E8E4D9] flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div id="philosophy" className="py-24 bg-[#E8E4D9]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full opacity-50"></div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6 relative z-10">
                  "Education is an atmosphere, a discipline, a life."
                </h2>
              </div>
              <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                We believe your planner should support this atmosphere, not clutter it. Kairos is built to be invisible when you don't need it and helpful when you do.
              </p>
              <ul className="space-y-4">
                {[
                  "Short lessons support",
                  "Nature study logging",
                  "Term-based scheduling",
                  "Exam week preparation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-700">
                    <Leaf size={18} className="text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Founding Families Beta Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5F6F52] text-white text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Limited Beta Access</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Join Our Founding Families</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Be among the first to shape Kairos Planner. Founding families get full access free during beta,
              plus exclusive perks when we officially launch.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Single Beta Card */}
            <div className="p-8 md:p-10 rounded-2xl border-2 border-[#5F6F52] bg-gradient-to-br from-white to-[#F6F4EE] shadow-xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5F6F52] text-white px-5 py-1.5 rounded-full text-sm font-bold">
                Founding Family Access
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-5xl font-serif font-bold text-[#5F6F52]">Free</span>
                  <span className="text-stone-400 line-through text-xl">$9.99/mo</span>
                </div>
                <p className="text-stone-600">During beta period • No credit card required</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> Unlimited Students</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> All Rhythms & Scheduling</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> Progress Reports</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> Portfolio Generation</li>
                </ul>
                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> CSV Import</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> AI Narration Assistant</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> Cloud Sync with Google</li>
                  <li className="flex items-center gap-2"><CheckCircle size={18} className="text-[#5F6F52]" /> Mobile Friendly</li>
                </ul>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-4 bg-[#5F6F52] text-white font-bold rounded-xl hover:bg-[#4A5A40] transition-colors text-lg shadow-lg shadow-[#5F6F52]/20"
              >
                Join as a Founding Family
              </button>

              <div className="mt-6 pt-6 border-t border-[#E8E4D9]">
                <p className="text-center text-sm text-stone-500 mb-4">Founding Family Perks at Launch:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-[#A9B388]/20 text-[#5F6F52] rounded-full text-xs font-medium">50% Off Forever</span>
                  <span className="px-3 py-1 bg-[#A9B388]/20 text-[#5F6F52] rounded-full text-xs font-medium">Early Feature Access</span>
                  <span className="px-3 py-1 bg-[#A9B388]/20 text-[#5F6F52] rounded-full text-xs font-medium">Founding Family Badge</span>
                  <span className="px-3 py-1 bg-[#A9B388]/20 text-[#5F6F52] rounded-full text-xs font-medium">Shape the Roadmap</span>
                </div>
              </div>
            </div>

            <p className="text-center text-stone-500 text-sm mt-8">
              Questions? Email us at <a href="mailto:hello@kairosplanner.com" className="text-[#5F6F52] hover:underline">hello@kairosplanner.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#5F6F52] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to bring peace to your homeschool?</h2>
          <p className="text-lg text-white/80 mb-10">
            Join our founding families and help shape the future of intentional homeschool planning.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-[#5F6F52] rounded-xl hover:bg-stone-100 transition-colors font-bold text-lg shadow-lg"
          >
            Join the Beta - It's Free
          </button>
          <p className="mt-4 text-white/60 text-sm">No credit card required</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Feather size={16} />
            <span className="font-serif font-bold text-stone-300">Kairos Planner</span>
          </div>
          <div className="flex gap-8 text-sm">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-stone-300">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-stone-300">Terms</button>
            <a href="mailto:support@kairosplanner.com" className="hover:text-stone-300">Contact</a>
          </div>
          <div className="text-sm">
            © 2025 Kairos Planner. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <LegalModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <p className="text-sm text-stone-500 mb-4">Last updated: January 2025</p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">1. Information We Collect</h3>
        <p className="text-stone-600 mb-4">
          Kairos Planner collects information you provide directly, including:
        </p>
        <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
          <li><strong>Account Information:</strong> Email address and name when you sign in with Google</li>
          <li><strong>Student Profiles:</strong> Names and ages of children you add to the planner</li>
          <li><strong>Planning Data:</strong> Tasks, schedules, rhythms, and completion records you create</li>
        </ul>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">2. How We Use Your Information</h3>
        <p className="text-stone-600 mb-4">We use your information to:</p>
        <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
          <li>Provide and maintain the Kairos Planner service</li>
          <li>Sync your data across devices when signed in</li>
          <li>Generate portfolio reports and summaries</li>
          <li>Improve our services and develop new features</li>
        </ul>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">3. Data Storage & Security</h3>
        <p className="text-stone-600 mb-4">
          Your data is stored securely using Google Firebase infrastructure. We implement industry-standard
          security measures to protect your information. Data is encrypted in transit and at rest.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">4. Data Sharing</h3>
        <p className="text-stone-600 mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share data only:
        </p>
        <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
          <li>With service providers who assist in operating our service (e.g., Firebase, Google AI)</li>
          <li>If required by law or to protect our rights</li>
        </ul>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">5. Your Rights</h3>
        <p className="text-stone-600 mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
          <li>Access your personal data</li>
          <li>Request deletion of your data</li>
          <li>Export your planning data</li>
          <li>Opt out of optional data collection</li>
        </ul>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">6. Children's Privacy</h3>
        <p className="text-stone-600 mb-4">
          Kairos Planner is designed for parents to manage their homeschool planning. We do not knowingly
          collect personal information directly from children. Student profiles are created and managed
          by parent account holders.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">7. Contact Us</h3>
        <p className="text-stone-600 mb-4">
          For privacy-related questions, contact us at{' '}
          <a href="mailto:privacy@kairosplanner.com" className="text-[#5F6F52] hover:underline">
            privacy@kairosplanner.com
          </a>
        </p>
      </LegalModal>

      {/* Terms of Service Modal */}
      <LegalModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <p className="text-sm text-stone-500 mb-4">Last updated: January 2025</p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">1. Acceptance of Terms</h3>
        <p className="text-stone-600 mb-4">
          By accessing or using Kairos Planner, you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use our service.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">2. Description of Service</h3>
        <p className="text-stone-600 mb-4">
          Kairos Planner is a digital homeschool planning tool designed for intentional
          homeschool families. The service allows you to organize curriculum, track student
          progress, and generate portfolio reports.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">3. User Accounts</h3>
        <p className="text-stone-600 mb-4">
          You may use Kairos Planner anonymously or create a permanent account by signing in with Google.
          You are responsible for maintaining the security of your account and all activities under it.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">4. Subscription & Payments</h3>
        <p className="text-stone-600 mb-4">
          Kairos Planner offers free and paid subscription tiers. Paid subscriptions are billed monthly
          or annually as selected. You may cancel at any time, and cancellation takes effect at the end
          of the current billing period.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">5. User Content</h3>
        <p className="text-stone-600 mb-4">
          You retain ownership of all content you create in Kairos Planner, including student profiles,
          tasks, and schedules. By using our service, you grant us a limited license to store and
          process this content solely to provide the service to you.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">6. Acceptable Use</h3>
        <p className="text-stone-600 mb-4">You agree not to:</p>
        <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the service</li>
          <li>Share your account credentials with others</li>
        </ul>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">7. Disclaimer of Warranties</h3>
        <p className="text-stone-600 mb-4">
          Kairos Planner is provided "as is" without warranties of any kind. We do not guarantee
          that the service will be uninterrupted, error-free, or meet your specific requirements.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">8. Limitation of Liability</h3>
        <p className="text-stone-600 mb-4">
          To the maximum extent permitted by law, Kairos Planner shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of the service.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">9. Changes to Terms</h3>
        <p className="text-stone-600 mb-4">
          We may update these terms from time to time. Continued use of the service after changes
          constitutes acceptance of the new terms.
        </p>

        <h3 className="text-lg font-bold text-stone-900 mt-6 mb-3">10. Contact</h3>
        <p className="text-stone-600 mb-4">
          For questions about these terms, contact us at{' '}
          <a href="mailto:support@kairosplanner.com" className="text-[#5F6F52] hover:underline">
            support@kairosplanner.com
          </a>
        </p>
      </LegalModal>
    </div>
  );
};

export default LandingPage;
