'use client';

import { useState } from 'react';

interface CTAProps {
  onStartTrial: () => void;
}

export default function CTA({ onStartTrial }: CTAProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would submit to your backend here
    console.log('Email submitted:', email);
    
    setIsSubmitting(false);
    setEmail('');
    alert('ご登録ありがとうございます！詳細情報をメールでお送りします。');
  };

  const features = [
    '無料トライアル期間中は全機能利用可能',
    'Google Maps API設定サポート付き',
    '導入説明・操作研修を無料提供',
    'CSVエクスポート機能も利用可能'
  ];

  const plans = [
    {
      name: '無料トライアル',
      price: '0円',
      period: '14日間',
      description: '全機能を制限なしで体験',
      features: [
        '検索回数制限なし',
        'CSV エクスポート',
        'マップ表示機能',
        'メールサポート'
      ],
      buttonText: '今すぐ無料で始める',
      buttonStyle: 'bg-gradient-to-r from-green-500 to-blue-500 text-white',
      popular: true
    },
    {
      name: 'スタンダード',
      price: '¥9,800',
      period: '月額',
      description: '中小企業・個人営業に最適',
      features: [
        '月間検索回数 1,000回',
        'CSV エクスポート無制限',
        '営業ルート最適化',
        'チャットサポート'
      ],
      buttonText: '詳細を見る',
      buttonStyle: 'bg-white text-blue-600 border-2 border-blue-600',
      popular: false
    },
    {
      name: 'プロフェッショナル',
      price: '¥24,800',
      period: '月額',
      description: '営業チーム・企業向け',
      features: [
        '月間検索回数 無制限',
        'チーム機能・権限管理',
        'API連携サポート',
        '電話・オンサイトサポート'
      ],
      buttonText: '詳細を見る',
      buttonStyle: 'bg-white text-blue-600 border-2 border-blue-600',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGwtcnVsZT0ibm9uemVybyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            今すぐ始めて
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              営業を革新
            </span>
            しませんか？
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            14日間の無料トライアルで全機能をお試しください。<br />
            設定サポートも無料で提供するので、今すぐ効果を実感できます。
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
              >
                {isSubmitting ? '送信中...' : '無料で始める'}
              </button>
            </div>
          </form>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-blue-100">
                <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Alternative CTA Button */}
          <div className="space-y-4">
            <button
              onClick={onStartTrial}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              今すぐツールを試す
            </button>
            <p className="text-blue-200 text-sm">
              クレジットカード不要・契約不要
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            シンプルで分かりやすい料金プラン
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-xl ${
                  plan.popular ? 'border-4 border-yellow-400 transform scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-bold">
                      おすすめ
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-600 font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${plan.buttonStyle} hover:shadow-lg`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              🔥 期間限定キャンペーン実施中
            </h3>
            <p className="text-blue-100 mb-6">
              今なら初回契約時に<span className="font-bold text-yellow-400">設定代行サービス</span>（通常¥50,000）を無料で提供！<br />
              さらに<span className="font-bold text-yellow-400">3ヶ月間の無料延長</span>も付いてきます。
            </p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">残り</div>
                <div className="text-3xl font-bold text-white">7日</div>
              </div>
              <div className="text-white text-2xl">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">限定</div>
                <div className="text-3xl font-bold text-white">50社</div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              キャンペーンに申し込む
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">よくある質問</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-bold text-white mb-2">Q. Google Maps APIキーは必要ですか？</h4>
              <p className="text-blue-100 text-sm">A. はい、必要です。取得方法と設定は無料でサポートいたします。</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-bold text-white mb-2">Q. 無料トライアルに制限はありますか？</h4>
              <p className="text-blue-100 text-sm">A. 14日間、全機能を制限なしでご利用いただけます。</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-bold text-white mb-2">Q. 契約の縛りはありますか？</h4>
              <p className="text-blue-100 text-sm">A. 月額プランで、いつでも解約可能です。違約金も一切ありません。</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-bold text-white mb-2">Q. サポートは受けられますか？</h4>
              <p className="text-blue-100 text-sm">A. メール・チャット・電話でのサポートを提供しております。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}