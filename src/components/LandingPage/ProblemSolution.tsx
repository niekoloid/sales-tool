'use client';

import { useState } from 'react';

export default function ProblemSolution() {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');

  const problems = [
    {
      icon: '⏱️',
      title: '手作業での情報収集に膨大な時間',
      description: 'Google検索やタウンページで一件ずつ調べるのに1日以上かかってしまう',
      impact: '営業時間の60%が情報収集に消費'
    },
    {
      icon: '🗺️',
      title: '営業範囲の地理的把握が困難',
      description: '効率的な営業ルートが分からず、無駄な移動時間が発生する',
      impact: '1日の移動時間が平均3時間'
    },
    {
      icon: '📋',
      title: 'データの整理・管理が煩雑',
      description: 'ExcelやWordでバラバラに管理され、情報の更新や共有が困難',
      impact: 'データ整理に週2時間を浪費'
    },
    {
      icon: '🎯',
      title: '営業対象の質の判断が困難',
      description: '店舗の評価や規模感が分からず、優先順位を付けられない',
      impact: '成約率が業界平均の50%以下'
    }
  ];

  const solutions = [
    {
      icon: '⚡',
      title: 'Google Maps API連携で瞬時にリスト生成',
      description: 'Google Mapsの豊富なデータベースから条件に合致する店舗を自動抽出',
      benefit: '情報収集時間を90%削減'
    },
    {
      icon: '🗺️',
      title: '地図上での視覚的な営業計画',
      description: '営業対象を地図上で確認でき、最適な営業ルートを一目で把握',
      benefit: '移動時間を平均40%短縮'
    },
    {
      icon: '📊',
      title: 'CSV一括エクスポートで既存ツール連携',
      description: 'CRMやSFAツールに簡単にインポートできる形式でデータを出力',
      benefit: 'データ管理工数を80%削減'
    },
    {
      icon: '🎯',
      title: '評価・レビュー数による優先度判定',
      description: '店舗の評価やレビュー数で営業優先度を自動算出',
      benefit: '成約率を平均2.3倍向上'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            営業活動の
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              課題
            </span>
            を
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              解決
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            従来の営業リスト作成の問題点を分析し、テクノロジーの力で根本的に解決します
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'problem'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              現在の課題
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'solution'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              解決策
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-[600px]">
          {/* Problems */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            activeTab === 'problem' ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
          }`}>
            <div className="grid md:grid-cols-2 gap-8">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{problem.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {problem.description}
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-red-700 font-medium text-sm">{problem.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            activeTab === 'solution' ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4'
          }`}>
            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{solution.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {solution.description}
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-700 font-medium text-sm">{solution.benefit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
            <h3 className="text-2xl font-bold text-white text-center">従来の方法 vs 営業アタックリストツール</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">項目</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-red-600">従来の方法</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-blue-600">本ツール</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">情報収集時間</td>
                  <td className="px-6 py-4 text-center text-red-600">8-10時間/日</td>
                  <td className="px-6 py-4 text-center text-blue-600">30分/日</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">データ精度</td>
                  <td className="px-6 py-4 text-center text-red-600">60-70%</td>
                  <td className="px-6 py-4 text-center text-blue-600">95%+</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">営業ルート最適化</td>
                  <td className="px-6 py-4 text-center text-red-600">手作業で困難</td>
                  <td className="px-6 py-4 text-center text-blue-600">自動で最適化</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">データ更新</td>
                  <td className="px-6 py-4 text-center text-red-600">月1回程度</td>
                  <td className="px-6 py-4 text-center text-blue-600">リアルタイム</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}