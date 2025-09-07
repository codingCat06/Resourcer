import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

          <div className="space-y-8 text-gray-700">
            {/* 개요 */}
            <section>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">개인정보처리방침 개요</h2>
                <p className="text-blue-800">
                  (주)Madon(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 
                  다음과 같이 개인정보처리방침을 수립·공개합니다.
                </p>
              </div>
            </section>

            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (개인정보의 처리목적)</h2>
              <p className="mb-3">회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
              <div className="ml-4 space-y-2">
                <div className="flex items-start">
                  <span className="font-semibold mr-3">1.</span>
                  <div>
                    <strong>회원 가입 및 관리:</strong> 회원가입 의사 확인, 회원제 서비스 제공, 본인식별·인증, 회원자격 유지·관리
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold mr-3">2.</span>
                  <div>
                    <strong>서비스 제공:</strong> API 및 모듈 추천 서비스 제공, 포스트 관리, 수익 배분
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold mr-3">3.</span>
                  <div>
                    <strong>고충처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보
                  </div>
                </div>
              </div>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (개인정보 수집항목 및 방법)</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">가. 수집항목</h3>
                  <div className="ml-4 space-y-2">
                    <p><strong>필수항목:</strong> 이메일, 사용자명, 비밀번호</p>
                    <p><strong>선택항목:</strong> 프로필 이미지, 전체 이름</p>
                    <p><strong>자동수집:</strong> IP주소, 쿠키, 방문일시, 서비스 이용기록, 접속로그</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">나. 수집방법</h3>
                  <div className="ml-4">
                    <p>홈페이지 회원가입, 서비스 이용 과정에서 이용자가 직접 입력하거나 자동으로 생성되는 정보</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (개인정보의 처리 및 보유기간)</h2>
              <div className="space-y-3">
                <p>1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                <div className="ml-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>회원가입 및 관리:</strong> 회원탈퇴 시까지</p>
                    <p><strong>서비스 이용기록:</strong> 3개월</p>
                    <p><strong>결제정보:</strong> 5년 (전자상거래법)</p>
                    <p><strong>민원처리:</strong> 처리완료 후 3년</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
              <div className="space-y-3">
                <p>1. 회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.</p>
                <p>2. 다만, 다음의 경우에는 예외로 합니다:</p>
                <div className="ml-4 space-y-1">
                  <p>- 이용자가 사전에 동의한 경우</p>
                  <p>- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</p>
                </div>
              </div>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (개인정보처리 위탁)</h2>
              <p className="leading-relaxed">
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </p>
              <div className="ml-4 bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>위탁받는 자:</strong> AWS (Amazon Web Services)</p>
                <p><strong>위탁하는 업무의 내용:</strong> 서버 호스팅 및 데이터 저장</p>
              </div>
            </section>

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (정보주체의 권리·의무 및 그 행사방법)</h2>
              <div className="space-y-3">
                <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
                <div className="ml-4 space-y-2">
                  <p>1. 개인정보 처리현황 통지요구</p>
                  <p>2. 개인정보 열람요구</p>
                  <p>3. 개인정보 정정·삭제요구</p>
                  <p>4. 개인정보 처리정지요구</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4">
                  <p className="text-sm"><strong>권리 행사 방법:</strong> codingcat06@gmail.com으로 서면, 전화, 이메일을 통하여 요청할 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (개인정보의 파기)</h2>
              <div className="space-y-3">
                <p>1. 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                <p>2. 파기절차 및 파기방법은 다음과 같습니다:</p>
                <div className="ml-4 space-y-2">
                  <p><strong>파기절차:</strong> 선정된 개인정보는 개인정보 보호책임자의 승인을 받아 파기합니다.</p>
                  <p><strong>파기방법:</strong> 전자적 파일형태는 복구 불가능한 방법으로 삭제하며, 종이문서는 분쇄기로 분쇄합니다.</p>
                </div>
              </div>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
              <p className="mb-3">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>1. 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</p>
                <p>2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</p>
                <p>3. 물리적 조치: 전산실, 자료보관실 등의 접근통제</p>
              </div>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (개인정보 보호책임자)</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">개인정보 보호책임자</p>
                <div className="space-y-1 text-sm">
                  <p>성명: (주)Madon 개인정보보호팀</p>
                  <p>연락처: codingcat06@gmail.com</p>
                  <p>※ 개인정보 보호 전담부서로 연결됩니다.</p>
                </div>
              </div>
            </section>

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (개인정보 처리방침 변경)</h2>
              <div className="space-y-2">
                <p>1. 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                <p>2. 본 방침은 2024년 1월 1일부터 시행됩니다.</p>
              </div>
            </section>

            {/* 연락처 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">문의처</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">(주)Madon Resourcer 서비스</p>
                <div className="space-y-1 text-blue-800 text-sm">
                  <p>개인정보 관련 문의: codingcat06@gmail.com</p>
                  <p>서비스 관련 문의: 하단 Footer의 "문의하기" 이용</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;