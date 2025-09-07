import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalClicks: number;
  totalEarnings: number;
  recentSearches: Array<{
    query_text: string;
    results_count: number;
    searched_at: string;
  }>;
  topPosts: Array<{
    title: string;
    click_count: number;
    total_earnings: number;
    username: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  const processEarnings = async () => {
    try {
      await adminAPI.processEarnings();
      alert('수익 처리가 완료되었습니다.');
      fetchStats(); // Refresh stats
    } catch (err: any) {
      alert('수익 처리에 실패했습니다: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-4 text-red-600 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600">시스템 전반의 통계와 관리 기능을 제공합니다.</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-600 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin/posts"
          className="p-6 text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <div className="text-sm">포스트 관리</div>
        </Link>
        
        <Link
          to="/admin/users"
          className="p-6 text-center text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <div className="text-sm">사용자 관리</div>
        </Link>
        
        <Link
          to="/admin/contacts"
          className="p-6 text-center text-white transition-colors bg-yellow-600 rounded-lg hover:bg-yellow-700"
        >
          <div className="text-2xl font-bold">📧</div>
          <div className="text-sm">문의 관리</div>
        </Link>
        
        <button
          onClick={processEarnings}
          className="p-6 text-center text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          <div className="text-2xl font-bold">💰</div>
          <div className="text-sm">수익 처리</div>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">총 사용자</div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
          <div className="text-sm text-gray-600">총 포스트</div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</div>
          <div className="text-sm text-gray-600">발행된 포스트</div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</div>
          <div className="text-sm text-gray-600">총 클릭</div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">${Number(stats.totalEarnings || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600">총 수익</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Earning Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">수익 상위 포스트</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topPosts.slice(0, 10).map((post, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {post.username} · {post.click_count} 클릭
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${Number(post.total_earnings || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">최근 검색어</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentSearches.slice(0, 10).map((search, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      "{search.query_text}"
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(search.searched_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {search.results_count}개 결과
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;