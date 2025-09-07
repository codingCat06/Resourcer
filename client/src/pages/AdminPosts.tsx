import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'published' | 'archived';
  click_count: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  full_name: string;
  tags: string[];
  apis_modules: string[];
  work_environment: string[];
}

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  const statusMap = {
    draft: '임시저장',
    published: '발행됨',
    archived: '보관됨'
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, sortBy, sortOrder]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPosts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: postsPerPage
      });
      setPosts(response.posts || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      await adminAPI.updatePostStatus(postId, newStatus);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, status: newStatus as Post['status'] } : post
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post status');
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      await Promise.all(
        selectedPosts.map(postId => adminAPI.updatePostStatus(postId, newStatus))
      );
      setPosts(posts.map(post => 
        selectedPosts.includes(post.id) 
          ? { ...post, status: newStatus as Post['status'] } 
          : post
      ));
      setSelectedPosts([]);
      alert(`${selectedPosts.length}개 포스트의 상태가 변경되었습니다.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update posts');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`선택한 ${selectedPosts.length}개 포스트를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedPosts.map(postId => adminAPI.deletePost(postId))
      );
      setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      alert(`${selectedPosts.length}개 포스트가 삭제되었습니다.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete posts');
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredPosts = posts.filter(post => 
    statusFilter === 'all' || post.status === statusFilter
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Post];
    let bValue: any = b[sortBy as keyof Post];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">포스트 관리</h1>
        <p className="text-gray-600">모든 포스트를 관리하고 상태를 변경할 수 있습니다.</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-600 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="draft">임시저장</option>
              <option value="published">발행됨</option>
              <option value="archived">보관됨</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">최신순</option>
              <option value="created_at-asc">오래된순</option>
              <option value="title-asc">제목 A-Z</option>
              <option value="title-desc">제목 Z-A</option>
              <option value="click_count-desc">클릭 많은순</option>
              <option value="total_earnings-desc">수익 높은순</option>
            </select>
          </div>

          {selectedPosts.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('published')}
                className="px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                발행 ({selectedPosts.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange('archived')}
                className="px-3 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              >
                보관 ({selectedPosts.length})
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                삭제 ({selectedPosts.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            포스트 목록 ({sortedPosts.length}개)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  클릭/수익
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {post.summary || post.content.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{post.username}</div>
                    <div className="text-sm text-gray-500">{post.full_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                      {statusMap[post.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{post.click_count} 클릭</div>
                    <div>${Number(post.total_earnings || 0).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="draft">임시저장</option>
                      <option value="published">발행</option>
                      <option value="archived">보관</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, sortedPosts.length)} of {sortedPosts.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;