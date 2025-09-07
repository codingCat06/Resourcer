import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  admin_notes?: string;
  admin_username?: string;
  created_at: string;
  updated_at: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    limit: 20,
    totalItems: 0
  });

  const subjectMap = {
    general: '일반 문의',
    technical: '기술 지원',
    business: '사업 제휴',
    bug: '버그 신고',
    feature: '기능 제안',
    other: '기타'
  };

  const statusMap = {
    new: '신규',
    in_progress: '처리중',
    resolved: '해결됨',
    closed: '종료'
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter, pagination.current]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getContacts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: pagination.current,
        limit: pagination.limit
      });
      setContacts(response.contacts);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId: number, newStatus: string, adminNotes?: string) => {
    try {
      await contactAPI.updateContact(contactId, {
        status: newStatus,
        admin_notes: adminNotes
      });
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus as any, admin_notes: adminNotes }
          : contact
      ));
      
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus as any, admin_notes: adminNotes });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update contact');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">문의 관리</h1>
        <p className="text-gray-600">접수된 문의사항을 관리할 수 있습니다.</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-600 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">상태:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="new">신규</option>
            <option value="in_progress">처리중</option>
            <option value="resolved">해결됨</option>
            <option value="closed">종료</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                문의 목록 ({pagination.totalItems}건)
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          #{contact.id} - {contact.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[contact.status]
                        }`}>
                          {statusMap[contact.status]}
                        </span>
                      </div>
                      <p className="mb-1 text-sm text-gray-600">
                        {subjectMap[contact.subject as keyof typeof subjectMap]} - {contact.email}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {contact.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(contact.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {((pagination.current - 1) * pagination.limit) + 1}-{Math.min(pagination.current * pagination.limit, pagination.totalItems)} of {pagination.totalItems}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    이전
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current === pagination.total}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <ContactDetail
              contact={selectedContact}
              onStatusChange={handleStatusChange}
              subjectMap={subjectMap}
              statusMap={statusMap}
            />
          ) : (
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-center text-gray-500">문의를 선택하여 상세 정보를 확인하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ContactDetailProps {
  contact: Contact;
  onStatusChange: (id: number, status: string, notes?: string) => void;
  subjectMap: Record<string, string>;
  statusMap: Record<string, string>;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onStatusChange, subjectMap, statusMap }) => {
  const [adminNotes, setAdminNotes] = useState(contact.admin_notes || '');
  const [newStatus, setNewStatus] = useState(contact.status);

  const handleUpdate = () => {
    onStatusChange(contact.id, newStatus, adminNotes);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">문의 상세</h3>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">문의번호</label>
          <p className="text-sm text-gray-900">#{contact.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <p className="text-sm text-gray-900">{contact.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <p className="text-sm text-gray-900">{contact.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">문의유형</label>
          <p className="text-sm text-gray-900">{subjectMap[contact.subject as keyof typeof subjectMap]}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">접수일시</label>
          <p className="text-sm text-gray-900">{new Date(contact.created_at).toLocaleString('ko-KR')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">메시지</label>
          <div className="p-3 mt-1 rounded-md bg-gray-50">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">상태</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Contact['status'])}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="new">신규</option>
            <option value="in_progress">처리중</option>
            <option value="resolved">해결됨</option>
            <option value="closed">종료</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">관리자 메모</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="처리 내용이나 메모를 작성하세요..."
          />
        </div>

        {contact.admin_username && (
          <div>
            <label className="block text-sm font-medium text-gray-700">처리자</label>
            <p className="text-sm text-gray-900">{contact.admin_username}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleUpdate}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            업데이트
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;