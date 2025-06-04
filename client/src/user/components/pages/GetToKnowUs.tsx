import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Users, Heart, Camera, Globe } from 'lucide-react';
import teamImage from '../../../assets/home/gettoknow.jpg';

interface TeamValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FloatingElement {
  icon: React.ReactNode;
  delay: number;
  position: string;
}

interface MousePosition {
  x: number;
  y: number;
}

const GetToKnowUs: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const teamValues: TeamValue[] = [
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Navigate with confidence through our curated experiences"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passionate Service",
      description: "Every journey crafted with love and attention to detail"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Connections spanning continents to unlock hidden gems"
    }
  ];

  const floatingElements: FloatingElement[] = [
    { icon: <MapPin className="w-6 h-6" />, delay: 0, position: "top-20 left-10" },
    { icon: <Camera className="w-5 h-5" />, delay: 1, position: "top-40 right-20" },
    { icon: <Compass className="w-7 h-7" />, delay: 2, position: "bottom-32 left-16" },
    { icon: <Users className="w-6 h-6" />, delay: 0.5, position: "top-60 right-10" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % teamValues.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [teamValues.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 overflow-hidden mt-3">

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Radial gradients using Tailwind's arbitrary values */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(120,119,198,0.3), transparent 50%)'
          }}
        />
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 70% 80%, rgba(255,154,158,0.3), transparent 50%)'
          }}
        />
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} text-white/30 animate-bounce`}
          style={{
            animationDelay: `${element.delay}s`,
            animationDuration: '3s'
          }}
        >
          {element.icon}
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Interactive Content */}
          <div className="space-y-8">
            {/* Main Heading with Gradient */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Globe className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Discover More</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Get to Know
                </span>
                <br />
                <span className="text-white">Traventure</span>
              </h2>
            </div>

            {/* Dynamic Description */}
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                We're not just another travel company. We're <span className="text-green-400 font-semibold">experience architects</span>, 
                crafting journeys that transform ordinary trips into extraordinary adventures.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-lg text-gray-200 leading-relaxed">
                  From hidden mountain trails to bustling local markets, our team of passionate explorers 
                  connects you with authentic experiences that create lasting memories.
                </p>
              </div>
            </div>

            {/* Interactive Value Cards */}
            <div className="space-y-4">
              {teamValues.map((value, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-500 border ${
                    activeCard === index
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveCard(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg transition-all duration-300 ${
                      activeCard === index ? 'bg-cyan-400 text-white' : 'bg-white/10 text-green-400'
                    }`}>
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{value.title}</h3>
                      <p className="text-gray-300">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Interactive Visual */}
          <div className="relative">
            {/* Main Interactive Container */}
            <div 
              className="relative h-[600px] group cursor-none"
              onMouseMove={handleMouseMove}
            >
              {/* Magnetic Cursor Effect */}
              <div 
                className="absolute w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-50 transition-all duration-200 mix-blend-difference"
                style={{
                  left: `${mousePosition.x}%`,
                  top: `${mousePosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Layered Visual Elements */}
              <div className="absolute inset-0">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/30 to-emerald-500/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                
                {/* Main Image Container */}
                <div className="absolute top-10 left-10 w-72 h-96 bg-gradient-to-br from-cyan-400 to-green-600 rounded-[3rem] p-1 shadow-2xl group-hover:rotate-2 transition-transform duration-700">
                  <div className="w-full h-full bg-slate-800 rounded-[2.8rem] overflow-hidden relative">
                    {/* Your team image */}
                    <img
                      src={teamImage}
                      alt="Traventure Team"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
                      <p className="text-slate-800 font-bold">Since 2020</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Visual Element */}
                <div className="absolute bottom-16 right-8 w-48 h-32 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-3xl shadow-xl group-hover:-rotate-3 transition-transform duration-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold text-lg">1000+</p>
                    <p className="text-sm opacity-90">Happy Travelers</p>
                  </div>
                </div>

                {/* Floating Stats */}
                <div 
                  className="absolute top-32 right-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                  style={{
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <div className="text-center text-white">
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <p className="font-bold">50+</p>
                    <p className="text-sm opacity-80">Destinations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="mt-8 text-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-green-600
 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default GetToKnowUs;