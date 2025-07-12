'use client';

import { useRouter } from 'next/navigation';
import Hero from '@/components/LandingPage/Hero';
import ProblemSolution from '@/components/LandingPage/ProblemSolution';
import Features from '@/components/LandingPage/Features';
import Benefits from '@/components/LandingPage/Benefits';
import Testimonials from '@/components/LandingPage/Testimonials';
import CTA from '@/components/LandingPage/CTA';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/');
  };

  const handleStartTrial = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  <span className="text-blue-600">営業アタックリスト</span>
                  <span className="text-gray-600">作成ツール</span>
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  機能
                </a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  導入効果
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  お客様の声
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  料金
                </a>
                <button
                  onClick={handleGetStarted}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  ツールを試す
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                試す
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <Hero onGetStarted={handleGetStarted} />

        {/* Problem & Solution Section */}
        <ProblemSolution />

        {/* Features Section */}
        <div id="features">
          <Features />
        </div>

        {/* Benefits Section */}
        <div id="benefits">
          <Benefits />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <Testimonials />
        </div>

        {/* CTA Section */}
        <div id="pricing">
          <CTA onStartTrial={handleStartTrial} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">営業アタックリスト作成ツール</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Google Maps APIを活用した次世代の営業支援ツール。
                営業活動の効率化を通じて、あなたのビジネスの成長を支援します。
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-lg">📧</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-lg">📞</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-lg">💼</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">クイックリンク</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">機能紹介</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">導入効果</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">お客様の声</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">料金プラン</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">サポート</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">よくある質問</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">導入支援</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">技術サポート</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 営業アタックリスト作成ツール. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">プライバシーポリシー</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">利用規約</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">特定商取引法</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}