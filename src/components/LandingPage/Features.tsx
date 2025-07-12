'use client';

import { useState } from 'react';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'search',
      title: '高度な検索フィルタリング',
      subtitle: '業種・距離・評価による精密検索',
      description: 'Google Maps APIと連携し、30種類以上の業種カテゴリから複数選択可能。距離範囲、レビュー数、評価による詳細フィルタリングで、ターゲットに最適な営業先を抽出します。',
      icon: '🔍',
      image: '/api/placeholder/600/400',
      benefits: [
        '30+ 業種カテゴリから複数選択',
        '0.5km〜50kmの距離範囲指定',
        '評価・レビュー数による品質フィルタ',
        '営業状況（営業中/休業中）で絞り込み'
      ]
    },
    {
      id: 'map',
      title: 'インタラクティブマップ表示',
      subtitle: '視覚的な営業計画策定',
      description: 'Google Mapsを使った直感的なマップインターフェース。営業対象を地図上で確認し、効率的なルート計画を立てることができます。現在地からの自動検索にも対応。',
      icon: '🗺️',
      image: '/api/placeholder/600/400',
      benefits: [
        '営業対象の地理的分布を一目で把握',
        '現在地からの自動検索機能',
        '営業ルートの視覚的最適化',
        'ズーム・パンによる詳細確認'
      ]
    },
    {
      id: 'export',
      title: 'CSV一括エクスポート',
      subtitle: '既存ツールとの完璧な連携',
      description: '検索結果をCSV形式で一括エクスポート。CRMやSFAツールへの簡単インポートが可能。日本語文字化けを防ぐUTF-8エンコーディング対応で安心です。',
      icon: '📊',
      image: '/api/placeholder/600/400',
      benefits: [
        'UTF-8エンコーディングで文字化け防止',
        'CRM/SFAツールへの簡単インポート',
        '13項目の詳細データを含む',
        'Google Maps URLも自動生成'
      ]
    },
    {
      id: 'realtime',
      title: 'リアルタイムデータ連携',
      subtitle: '常に最新の店舗情報',
      description: 'Google Maps APIから常に最新のデータを取得。店舗の営業状況、評価、電話番号などの情報が自動更新されるため、古い情報での営業活動を防げます。',
      icon: '⚡',
      image: '/api/placeholder/600/400',
      benefits: [
        'Google Mapsと同期した最新情報',
        '営業状況の自動更新',
        '新規開業店舗の即座反映',
        '閉店・移転情報の自動除外'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              強力な機能
            </span>
            で営業を革新
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Google Maps APIの豊富なデータと最新のテクノロジーを組み合わせた、営業活動を劇的に効率化する機能群
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeFeature === index
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="hidden sm:inline">{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Description */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {features[activeFeature].title}
              </h3>
              <p className="text-xl text-blue-600 font-medium mb-6">
                {features[activeFeature].subtitle}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {features[activeFeature].description}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">主な特徴</h4>
              <div className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              {/* Dynamic Feature Demo */}
              {activeFeature === 0 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">検索条件設定</h5>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-sm text-blue-600">🍽️ レストラン</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <span className="text-sm text-green-600">🏪 小売店</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">検索範囲</span>
                          <span className="text-sm font-medium text-blue-600">5.0km</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✓ 127件の営業先を発見
                    </span>
                  </div>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-200 h-48 flex items-center justify-center relative">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p>インタラクティブマップ</p>
                      </div>
                      {/* Floating markers */}
                      <div className="absolute top-4 left-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">📍</div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600">現在地周辺の営業先をマップ上で確認</p>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">エクスポート準備完了</h5>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">127件</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ファイル形式</span>
                        <span className="font-medium">UTF-8 CSV</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">データ項目</span>
                        <span className="font-medium">13項目</span>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium">
                        📄 営業リスト_2024-01-15.csv をダウンロード
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 3 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">データ同期状況</h5>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">リアルタイム更新中</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">新規店舗3件を追加</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                        <span className="text-blue-600">↻</span>
                        <span className="text-sm">営業時間情報を更新</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-600">⚠</span>
                        <span className="text-sm">閉店店舗1件を除外</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating metrics */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              機能 {activeFeature + 1}/4
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">技術仕様</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Google Maps API</h4>
              <p className="text-sm text-gray-600">Places API、Geocoding API、Maps JavaScript APIを統合活用</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">高速処理</h4>
              <p className="text-sm text-gray-600">並列処理により平均0.5秒で検索結果を表示</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">セキュリティ</h4>
              <p className="text-sm text-gray-600">HTTPS通信、API キー暗号化による安全なデータ処理</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}