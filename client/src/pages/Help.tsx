import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">도움말</h1>

          {/* Getting Started */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">시작하기</h2>
            <div className="space-y-4 text-gray-700">
              <p>Resourcer는 개발자들이 API와 모듈을 쉽게 찾고 추천받을 수 있는 플랫폼입니다.</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">주요 기능:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>API 및 모듈 검색</li>
                  <li>개발 환경별 필터링</li>
                  <li>실제 코드 예시 제공</li>
                  <li>개발자 리뷰 및 추천</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Search */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">검색하는 방법</h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">1. 키워드 검색</h3>
                  <p className="text-sm">구현하고자 하는 기능이나 사용하려는 기술을 검색하세요.</p>
                  <p className="text-xs text-gray-500 mt-1">예: "인증", "결제", "이미지 업로드"</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">2. 환경 선택</h3>
                  <p className="text-sm">사용 중인 개발 환경을 선택하여 맞춤 결과를 받아보세요.</p>
                  <p className="text-xs text-gray-500 mt-1">예: React, Node.js, Python 등</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Post */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">포스트 작성하기</h2>
            <div className="space-y-4 text-gray-700">
              <p>다른 개발자들에게 유용한 API나 모듈을 추천해보세요!</p>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">작성 가이드라인:</h3>
                <div className="space-y-2 text-green-800">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    <div>
                      <strong>타입 선택:</strong> API인지 Module인지 명확히 구분
                      <p className="text-sm text-green-700">• API: 웹 서비스 (Stripe API, SendGrid API 등)</p>
                      <p className="text-sm text-green-700">• Module: 설치하는 라이브러리 (React, Express 등)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    <div>
                      <strong>목표 명시:</strong> 이 도구로 무엇을 달성할 수 있는지 설명
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    <div>
                      <strong>코드 예시:</strong> Import문과 실제 사용 코드 제공
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">계정 관리</h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">회원가입</h3>
                  <p className="text-sm">이메일과 사용자명으로 간단히 가입할 수 있습니다.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">대시보드</h3>
                  <p className="text-sm">작성한 포스트와 수익을 확인할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900">Q. API와 Module의 차이점은 무엇인가요?</h3>
                <p className="text-gray-700 mt-1">API는 HTTP로 호출하는 웹 서비스이고, Module은 프로젝트에 설치하는 라이브러리입니다.</p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900">Q. 수익은 어떻게 계산되나요?</h3>
                <p className="text-gray-700 mt-1">포스트 조회수에 따라 광고 수익의 70%를 작성자가 가져갑니다.</p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900">Q. 포스트 수정이나 삭제는 어떻게 하나요?</h3>
                <p className="text-gray-700 mt-1">대시보드에서 본인이 작성한 포스트를 수정하거나 삭제할 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">문의하기</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                추가적인 도움이 필요하시거나 문제가 발생했다면 언제든 문의해주세요.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">이메일:</span>
                <a href="mailto:codingcat06@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  codingcat06@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                하단 Footer의 "문의하기" 버튼을 통해서도 문의할 수 있습니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;