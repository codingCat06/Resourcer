import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  subscription_type: 'free' | 'pro';
  total_earnings: number;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  last_login: string;
  post_count?: number;
  total_clicks?: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  const subscriptionMap = {
    free: '무료',
    pro: '프로'
  };

  const subscriptionColors = {
    free: 'bg-gray-100 text-gray-800',
    pro: 'bg-purple-100 text-purple-800'
  };

  useEffect(() => {
    fetchUsers();
  }, [subscriptionFilter, statusFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({
        subscription_type: subscriptionFilter === 'all' ? undefined : subscriptionFilter,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        sortBy,
        sortOrder,
        page: currentPage,
        limit: usersPerPage
      });
      setUsers(response.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async (userId: number, newSubscription: string) => {
    try {
      await adminAPI.updateUserSubscription(userId, newSubscription);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, subscription_type: newSubscription as User['subscription_type'] } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user subscription');
    }
  };

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    try {
      await adminAPI.updateUserStatus(userId, isActive);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: isActive } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleAdminStatusChange = async (userId: number, isAdmin: boolean) => {
    try {
      await adminAPI.updateUserAdminStatus(userId, isAdmin);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: isAdmin } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user admin status');
    }
  };

  const handleBulkSubscriptionChange = async (newSubscription: string) => {
    try {
      await Promise.all(
        selectedUsers.map(userId => adminAPI.updateUserSubscription(userId, newSubscription))
      );
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, subscription_type: newSubscription as User['subscription_type'] } 
          : user
      ));
      setSelectedUsers([]);
      alert(`${selectedUsers.length}명의 사용자 구독이 변경되었습니다.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update users');
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    const action = isActive ? '활성화' : '비활성화';
    if (!confirm(`선택한 ${selectedUsers.length}명의 사용자를 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(userId => adminAPI.updateUserStatus(userId, isActive))
      );
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, is_active: isActive } : user
      ));
      setSelectedUsers([]);
      alert(`${selectedUsers.length}명의 사용자가 ${action}되었습니다.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update users');
    }
  };

  const handleBulkAdminChange = async (isAdmin: boolean) => {
    const action = isAdmin ? '관리자 지정' : '관리자 해제';
    if (!confirm(`선택한 ${selectedUsers.length}명의 사용자를 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(userId => adminAPI.updateUserAdminStatus(userId, isAdmin))
      );
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, is_admin: isAdmin } : user
      ));
      setSelectedUsers([]);
      alert(`${selectedUsers.length}명의 사용자가 ${action}되었습니다.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user admin status');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSubscription = subscriptionFilter === 'all' || user.subscription_type === subscriptionFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    const matchesSearch = searchTerm === '' || 
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSubscription && matchesStatus && matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any = a[sortBy as keyof User];
    let bValue: any = b[sortBy as keyof User];

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600">모든 사용자를 관리하고 구독 상태를 변경할 수 있습니다.</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-600 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <input
              type="text"
              placeholder="사용자명, 이메일, 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 구독</option>
              <option value="free">무료</option>
              <option value="pro">프로</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">최신 가입순</option>
              <option value="created_at-asc">오래된 가입순</option>
              <option value="username-asc">사용자명 A-Z</option>
              <option value="total_earnings-desc">수익 높은순</option>
            </select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleBulkSubscriptionChange('pro')}
              className="px-3 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
            >
              프로 구독 ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkSubscriptionChange('free')}
              className="px-3 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              무료 구독 ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkStatusChange(true)}
              className="px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              활성화 ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkStatusChange(false)}
              className="px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            >
              비활성화 ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkAdminChange(true)}
              className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              관리자 지정 ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkAdminChange(false)}
              className="px-3 py-2 text-sm text-white bg-orange-600 rounded hover:bg-orange-700"
            >
              관리자 해제 ({selectedUsers.length})
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            사용자 목록 ({sortedUsers.length}명)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  사용자
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  구독
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  수익
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  가입일
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                          {user.is_admin && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              관리자
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionColors[user.subscription_type]}`}>
                      {subscriptionMap[user.subscription_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${Number(user.total_earnings || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-1">
                        <select
                          value={user.subscription_type}
                          onChange={(e) => handleSubscriptionChange(user.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="free">무료</option>
                          <option value="pro">프로</option>
                        </select>
                        <button
                          onClick={() => handleStatusChange(user.id, !user.is_active)}
                          className={`px-2 py-1 text-xs rounded ${
                            user.is_active 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {user.is_active ? '비활성화' : '활성화'}
                        </button>
                      </div>
                      <button
                        onClick={() => handleAdminStatusChange(user.id, !user.is_admin)}
                        className={`px-2 py-1 text-xs rounded w-full ${
                          user.is_admin 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {user.is_admin ? '관리자 해제' : '관리자 지정'}
                      </button>
                    </div>
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
              {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length}
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

export default AdminUsers;