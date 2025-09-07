import React, { useState, useEffect } from 'react';
import { contactAPI, authAPI } from '../services/api';

const Footer: React.FC = () => {
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          setUser(response.user);
          setContactForm(prev => ({
            ...prev,
            name: response.user.full_name || response.user.username || '',
            email: response.user.email || ''
          }));
        } catch (error) {
          // User not logged in
        }
      }
    };
    
    if (showContact) {
      checkUser();
    }
  }, [showContact]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      await contactAPI.submitContact(contactForm);
      setSubmitMessage('문의사항이 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setSubmitMessage(error.response?.data?.message || '전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <footer className="text-white bg-gray-900">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <span className="text-sm font-bold text-white">R</span>
                </div>
                <span className="text-xl font-bold">Resourcer</span>
              </div>
              <p className="mb-4 text-gray-300">
                개발자를 위한 최고의 API 및 모듈 추천 플랫폼
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><strong className="text-white">(주) Madon</strong></p>
                <p>제작자: codingcat06@gmail.com</p>
                <p>© 2024 Resourcer. All rights reserved.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">바로가기</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="transition-colors hover:text-white">홈</a></li>
                <li><a href="/search" className="transition-colors hover:text-white">검색</a></li>
                <li><a href="/dashboard" className="transition-colors hover:text-white">대시보드</a></li>
                <li><a href="/create-post" className="transition-colors hover:text-white">포스트 작성</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">지원</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => setShowContact(true)}
                    className="text-left transition-colors hover:text-white"
                  >
                    문의하기
                  </button>
                </li>
                <li><a href="/help" className="transition-colors hover:text-white">도움말</a></li>
                <li><a href="/terms" className="transition-colors hover:text-white">이용약관</a></li>
                <li><a href="/privacy" className="transition-colors hover:text-white">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-700 md:flex-row">
            <p className="text-sm text-gray-400">
              개발자들이 더 나은 소프트웨어를 만들 수 있도록 돕습니다.
            </p>
            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <a href="mailto:codingcat06@gmail.com" className="text-gray-400 transition-colors hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.111.221.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContact(false);
              setSubmitMessage('');
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">문의하기</h3>
                <button
                  onClick={() => {
                    setShowContact(false);
                    setSubmitMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitMessage && (
                <div className={`mb-4 p-3 rounded ${submitMessage.includes('성공') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={contactForm.name}
                    onChange={handleContactChange}
                    disabled={!!user}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      user ? 'bg-gray-100 text-gray-600' : ''
                    }`}
                    placeholder="홍길동"
                  />
                  {user && (
                    <p className="mt-1 text-xs text-gray-500">로그인된 계정 정보가 자동으로 입력되었습니다.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={handleContactChange}
                    disabled={!!user}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      user ? 'bg-gray-100 text-gray-600' : ''
                    }`}
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-700">
                    문의 유형 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="general">일반 문의</option>
                    <option value="technical">기술 지원</option>
                    <option value="business">사업 제휴</option>
                    <option value="bug">버그 신고</option>
                    <option value="feature">기능 제안</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">
                    메시지 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="문의사항을 자세히 적어주세요..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContact(false);
                      setSubmitMessage('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? '전송 중...' : '전송하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;