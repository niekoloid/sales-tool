'use client';

import { useState, useEffect } from 'react';

export default function Benefits() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      value: 90,
      unit: '%',
      label: '情報収集時間削減',
      description: '従来8時間かかっていた作業が30分に短縮',
      icon: '⏱️',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      value: 127,
      unit: '件',
      label: '平均検索結果数',
      description: '1回の検索で質の高い営業先を大量発見',
      icon: '🎯',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      value: 2.3,
      unit: '倍',
      label: '成約率向上',
      description: '質の高いデータにより営業効率が大幅改善',
      icon: '📈',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      value: 40,
      unit: '%',
      label: '移動時間短縮',
      description: '地図表示により最適な営業ルートを実現',
      icon: '🚗',
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-orange-600'
    }
  ];

  const roiCalculator = {
    timeValue: 3000, // 1時間あたりの営業担当者の時給（円）
    timeSaved: 7.5, // 1日あたりの時短時間
    workingDays: 22, // 月間営業日数
    conversionImprovement: 0.15 // 成約率改善分
  };

  const monthlyTimeSaving = roiCalculator.timeSaved * roiCalculator.workingDays;
  const monthlyMoneySaving = monthlyTimeSaving * roiCalculator.timeValue;
  const yearlyMoneySaving = monthlyMoneySaving * 12;

  const benefits = [
    {
      category: '時間効率',
      title: '劇的な時間短縮を実現',
      items: [
        { metric: '情報収集', before: '8時間/日', after: '30分/日', improvement: '94%短縮' },
        { metric: 'データ整理', before: '2時間/週', after: '10分/週', improvement: '92%短縮' },
        { metric: 'ルート計画', before: '1時間/日', after: '5分/日', improvement: '92%短縮' }
      ],
      icon: '⚡',
      color: 'blue'
    },
    {
      category: 'データ品質',
      title: '正確性と信頼性の向上',
      items: [
        { metric: 'データ精度', before: '60-70%', after: '95%+', improvement: '35%向上' },
        { metric: '情報鮮度', before: '月1回更新', after: 'リアルタイム', improvement: '常に最新' },
        { metric: '項目数', before: '5-7項目', after: '13項目', improvement: '2倍の詳細度' }
      ],
      icon: '🎯',
      color: 'green'
    },
    {
      category: '営業成果',
      title: '売上向上への直接貢献',
      items: [
        { metric: '成約率', before: '5-8%', after: '12-18%', improvement: '2.3倍向上' },
        { metric: '営業効率', before: '1件/日', after: '2.5件/日', improvement: '150%向上' },
        { metric: '新規開拓', before: '月10件', after: '月25件', improvement: '150%増加' }
      ],
      icon: '📈',
      color: 'purple'
    }
  ];

  const CountUpNumber = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const startTime = Date.now();
      const startValue = 0;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOut cubic
        const currentCount = startValue + (end - startValue) * easedProgress;

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(updateCount);
    }, [end, duration]); // isVisible is intentionally excluded

    return (
      <span>
        {end > 10 ? Math.round(count) : count.toFixed(1)}
        {suffix}
      </span>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            導入効果で実感する
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              ROI
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            実際の数値で証明する圧倒的な効率化効果。投資対効果は導入から即座に実感できます。
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${metric.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                {metric.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                <CountUpNumber end={metric.value} suffix={metric.unit} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.label}</h3>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
            <h3 className="text-2xl font-bold text-white text-center">投資対効果（ROI）シミュレーション</h3>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">月間コスト削減</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ¥<CountUpNumber end={monthlyMoneySaving} />
                </div>
                <p className="text-sm text-gray-600">時短による人件費削減効果</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">年間削減時間</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <CountUpNumber end={monthlyTimeSaving * 12} />時間
                </div>
                <p className="text-sm text-gray-600">より多くの時間を営業活動に</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">年間ROI</h4>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  <CountUpNumber end={Math.round((yearlyMoneySaving / 100000) * 100)} />%
                </div>
                <p className="text-sm text-gray-600">投資額の回収倍率</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-3">試算条件</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>• 営業担当者時給: ¥{roiCalculator.timeValue.toLocaleString()}</div>
                <div>• 1日あたり時短: {roiCalculator.timeSaved}時間</div>
                <div>• 月間営業日数: {roiCalculator.workingDays}日</div>
                <div>• 成約率改善: +{roiCalculator.conversionImprovement * 100}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Benefits */}
        <div className="space-y-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r from-${benefit.color}-500 to-${benefit.color}-600 p-6`}>
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{benefit.icon}</span>
                  <div>
                    <div className="text-sm text-white/80 uppercase tracking-wide">{benefit.category}</div>
                    <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">指標</th>
                        <th className="text-center py-3 px-4 font-medium text-red-600">従来</th>
                        <th className="text-center py-3 px-4 font-medium text-green-600">導入後</th>
                        <th className="text-center py-3 px-4 font-medium text-blue-600">改善効果</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benefit.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-4 px-4 font-medium text-gray-900">{item.metric}</td>
                          <td className="py-4 px-4 text-center text-red-600">{item.before}</td>
                          <td className="py-4 px-4 text-center text-green-600 font-semibold">{item.after}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.improvement}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">今すぐ効果を実感してください</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              無料トライアルで実際の数値改善を体験。導入効果は初日から実感できます。
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              無料で効果を確認する
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}