'use client';
import Link from 'next/link';
import { FiImage, FiType, FiDownload, FiLayers, FiZap, FiStar } from 'react-icons/fi';
import Header from '@/components/Header';
import { Particles } from "@/components/ui/particles";

export default function Home() {
  const features = [
    {
      icon: <FiLayers className="w-6 h-6 text-blue-400" />,
      title: 'AI Background Removal',
      description: 'Remove backgrounds instantly with our advanced AI technology. Perfect for product photos and portraits.',
    },
    {
      icon: <FiType className="w-6 h-6 text-purple-400" />,
      title: 'Advanced Typography',
      description: 'Create stunning text designs with custom fonts, gradients, and effects. Perfect for social media and marketing.',
    },
    {
      icon: <FiDownload className="w-6 h-6 text-blue-400" />,
      title: 'Quick Export',
      description: 'Export your creations in multiple formats with high quality. Ready to share or use in your projects.',
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
          {/* Particles Effect */}
          <Particles
            className="absolute inset-0"
            quantity={100}
            ease={80}
            color="#8692FE"
            size={0.5}
            staticity={50}
          />
          
          {/* Round Glow Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
              <div className="absolute inset-0 rounded-full bg-[#8692FE]/25 blur-[150px]" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <div className="inline-block animate-float">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-[#8692FE]/10 text-[#8692FE] ring-1 ring-inset ring-[#8692FE]/30 mb-6">
                <FiZap className="mr-1" /> AI-Powered Image Editing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Text behind Images{' '}
              <span className="bg-gradient-to-r from-[#8692FE] to-[#8692FE] text-transparent bg-clip-text">
                with AI
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Use our intuitive editor to Place text behind image or subject with ease.Upload your photos, add stunning text effects, and create professional designs in seconds.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                href="/editor"
                className="inline-flex items-center px-8 py-4 bg-[#8692FE] hover:bg-[#6B77E5] text-white font-medium rounded-xl text-lg transition-all transform hover:scale-105"
              >
                Start Creating
                <FiImage className="ml-2" />
              </Link>
              <a 
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-lg transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 tra">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-[#8692FE]/30 mb-6">
              <FiStar className="mr-1" /> Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">Powerful tools for your creative journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-[#141519]/40 backdrop-blur-sm rounded-xl transition-all duration-300 border border-[#585B7A]/40"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#8692FE]/5 to-[#c084fc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl border border-white/10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Images?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who trust PixelCraft AI for their image editing needs.
              </p>
              <Link 
                href="/editor"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 font-bold rounded-xl text-lg transition-all transform hover:scale-105"
              >
                Start Creating Now
                <FiZap className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
