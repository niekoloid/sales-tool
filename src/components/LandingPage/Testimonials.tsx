'use client';

import { useState } from 'react';

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: '田中 健太郎',
      position: '営業部長',
      company: '株式会社マーケティングソリューションズ',
      industry: 'マーケティング支援',
      image: '/api/placeholder/80/80',
      content: '導入前は営業リスト作成に毎日3-4時間かかっていましたが、今では30分以内で完了します。しかも精度が圧倒的に高く、成約率が2.5倍になりました。営業チーム全体の生産性が劇的に向上し、月次売上目標を3ヶ月連続で120%超達成しています。',
      metrics: {
        timeSaved: '90%',
        conversionRate: '2.5倍',
        productivity: '120%'
      },
      rating: 5
    },
    {
      id: 2,
      name: '佐藤 美咲',
      position: 'セールスマネージャー',
      company: 'テクノロジー株式会社',
      industry: 'IT・システム開発',
      image: '/api/placeholder/80/80',
      content: '特に地図表示機能が素晴らしく、営業ルートの最適化で移動時間が40%短縮できました。現在地から自動で検索できるので、外回り中でも新しい営業先を見つけられます。チーム全体で情報共有もスムーズになり、営業効率が格段に上がりました。',
      metrics: {
        routeOptimization: '40%',
        newLeads: '300%',
        teamEfficiency: '85%'
      },
      rating: 5
    },
    {
      id: 3,
      name: '山田 雄介',
      position: '代表取締役',
      company: '合同会社ビジネスパートナーズ',
      industry: '経営コンサルティング',
      image: '/api/placeholder/80/80',
      content: 'スタートアップ企業として限られたリソースの中で、このツールは本当に救世主でした。1人で営業活動をしていますが、まるで営業チームがいるような効率性を実現できています。CSV出力機能でCRMとの連携も完璧で、投資対効果は導入初月から実感できました。',
      metrics: {
        costReduction: '70%',
        leadGeneration: '400%',
        roi: '300%'
      },
      rating: 5
    },
    {
      id: 4,
      name: '木村 智子',
      position: '営業課長',
      company: '株式会社リテールソリューション',
      industry: '小売・流通支援',
      image: '/api/placeholder/80/80',
      content: '小売店舗への営業で業種フィルタリング機能が非常に有効です。コンビニ、スーパー、専門店など細かく分類して検索でき、ターゲットに最適な営業先をピンポイントで見つけられます。新人営業員でも即戦力として活躍できるようになり、チーム全体のレベルアップを実現できました。',
      metrics: {
        targetAccuracy: '95%',
        newMemberProductivity: '200%',
        teamPerformance: '150%'
      },
      rating: 5
    }
  ];

  const stats = [
    { label: '利用企業数', value: '500+', icon: '🏢' },
    { label: '生成リスト数', value: '10万+', icon: '📋' },
    { label: '時短時間', value: '50万時間+', icon: '⏰' },
    { label: '顧客満足度', value: '98%', icon: '⭐' }
  ];

  const industries = [
    'IT・システム開発', 'マーケティング支援', '経営コンサルティング', 
    '不動産', '保険・金融', '製造業', '小売・流通', '医療・介護',
    '教育・研修', '広告・PR', '人材紹介', 'その他'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              お客様の声
            </span>
            が証明する効果
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            様々な業界の営業チームが実感している劇的な効果改善。実際の数値とともにお客様の声をご紹介します。
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setActiveTestimonial(index)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTestimonial === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {testimonial.company}
            </button>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100 mb-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Testimonial Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[activeTestimonial].content}&rdquo;
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</div>
                  <div className="text-blue-600 font-medium">{testimonials[activeTestimonial].position}</div>
                  <div className="text-gray-600 text-sm">{testimonials[activeTestimonial].company}</div>
                  <div className="text-gray-500 text-sm">{testimonials[activeTestimonial].industry}</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 text-center">導入効果</h4>
              <div className="space-y-4">
                {Object.entries(testimonials[activeTestimonial].metrics).map(([key, value], index) => {
                  const labels: Record<string, string> = {
                    timeSaved: '時間削減',
                    conversionRate: '成約率向上',
                    productivity: '生産性向上',
                    routeOptimization: 'ルート最適化',
                    newLeads: '新規開拓',
                    teamEfficiency: 'チーム効率',
                    costReduction: 'コスト削減',
                    leadGeneration: 'リード生成',
                    roi: 'ROI',
                    targetAccuracy: 'ターゲット精度',
                    newMemberProductivity: '新人生産性',
                    teamPerformance: 'チーム成果'
                  };
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{labels[key]}</span>
                      <span className="font-bold text-lg text-blue-600">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Industry Success */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            様々な業界で導入実績
          </h3>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-700">{industry}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              業界を問わず営業活動の効率化を実現。<br />
              あなたの業界でも同様の効果が期待できます。
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              導入事例を詳しく見る
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">セキュリティ保証</div>
                <div className="text-sm text-gray-600">HTTPS通信・データ暗号化</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">サポート充実</div>
                <div className="text-sm text-gray-600">導入支援・操作研修</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">即効性</div>
                <div className="text-sm text-gray-600">導入初日から効果実感</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}