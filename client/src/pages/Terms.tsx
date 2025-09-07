import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>

          <div className="space-y-8 text-gray-700">
            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="leading-relaxed">
                이 약관은 (주)Madon에서 운영하는 Resourcer 서비스(이하 "서비스")의 이용과 관련하여 
                회사와 이용자 간의 권리와 의무, 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-2">
                <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                <div className="ml-4 space-y-2">
                  <p>1. "서비스"란 (주)Madon이 제공하는 API 및 모듈 추천 플랫폼을 의미합니다.</p>
                  <p>2. "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.</p>
                  <p>3. "회원"란 서비스에 회원가입을 하고 서비스를 이용하는 자를 의미합니다.</p>
                  <p>4. "포스트"란 회원이 서비스에 게시하는 API 및 모듈 관련 정보를 의미합니다.</p>
                </div>
              </div>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 명시와 개정)</h2>
              <div className="space-y-2">
                <p>1. 회사는 본 약관을 서비스 웹사이트에 게시하여 이용자가 쉽게 알 수 있도록 합니다.</p>
                <p>2. 회사는 관련 법령에 위배되지 않는 범위 내에서 본 약관을 개정할 수 있습니다.</p>
                <p>3. 약관 개정 시 회사는 개정된 약관을 적용일자 7일 이전부터 공지합니다.</p>
              </div>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
              <div className="space-y-2">
                <p>회사가 제공하는 서비스는 다음과 같습니다:</p>
                <div className="ml-4 space-y-2">
                  <p>1. API 및 모듈 정보 검색 서비스</p>
                  <p>2. 개발자간 추천 및 리뷰 공유 서비스</p>
                  <p>3. 포스트 작성 및 수익 배분 서비스</p>
                  <p>4. 기타 회사가 정하는 서비스</p>
                </div>
              </div>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (회원가입)</h2>
              <div className="space-y-2">
                <p>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
                <p>2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다:</p>
                <div className="ml-4 space-y-1">
                  <p>- 가입신청자가 이전에 약관 위반으로 회원자격을 상실한 적이 있는 경우</p>
                  <p>- 실명이 아니거나 타인의 명의를 이용한 경우</p>
                  <p>- 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</p>
                </div>
              </div>
            </section>

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (회원정보 변경)</h2>
              <p className="leading-relaxed">
                회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 
                다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.
              </p>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (포스트 및 콘텐츠)</h2>
              <div className="space-y-2">
                <p>1. 회원이 작성하는 포스트는 다음 내용을 포함해야 합니다:</p>
                <div className="ml-4 space-y-1">
                  <p>- API 또는 모듈의 정확한 정보</p>
                  <p>- 실제 사용 가능한 코드 예시</p>
                  <p>- 사용 목적 및 효과에 대한 명확한 설명</p>
                </div>
                <p>2. 회원은 다음과 같은 내용의 포스트를 작성할 수 없습니다:</p>
                <div className="ml-4 space-y-1">
                  <p>- 허위 또는 과장된 정보</p>
                  <p>- 저작권을 침해하는 내용</p>
                  <p>- 악성 코드나 보안상 위험한 내용</p>
                  <p>- 법령에 위반되는 내용</p>
                </div>
              </div>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (수익 배분)</h2>
              <div className="space-y-2">
                <p>1. 회사는 포스트 조회수에 따른 광고 수익의 70%를 포스트 작성자에게 배분합니다.</p>
                <p>2. 수익 배분은 월 단위로 정산되며, 최소 지급 기준은 10,000원입니다.</p>
                <p>3. 부정한 방법으로 조회수를 늘린 경우 수익 배분에서 제외됩니다.</p>
              </div>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (개인정보보호)</h2>
              <p className="leading-relaxed">
                회사는 개인정보보호법 등 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 
                개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.
              </p>
            </section>

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (회원탈퇴 및 자격 상실)</h2>
              <div className="space-y-2">
                <p>1. 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</p>
                <p>2. 회원이 다음 각호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:</p>
                <div className="ml-4 space-y-1">
                  <p>- 가입 신청 시에 허위 내용을 등록한 경우</p>
                  <p>- 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 경우</p>
                  <p>- 서비스를 이용하여 법령과 본 약관이 금지하는 행위를 하는 경우</p>
                </div>
              </div>
            </section>

            {/* 제11조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제11조 (손해배상)</h2>
              <p className="leading-relaxed">
                회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 
                회사가 고의 또는 중과실로 인한 손해를 제외하고는 이에 대하여 책임을 지지 않습니다.
              </p>
            </section>

            {/* 제12조 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제12조 (분쟁해결)</h2>
              <div className="space-y-2">
                <p>1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해의 보상 등에 관하여 처리하기 위하여 피해보상처리기구를 설치 운영합니다.</p>
                <p>2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.</p>
              </div>
            </section>

            {/* 부칙 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">부칙</h2>
              <p className="text-sm text-gray-600">
                본 약관은 2024년 1월 1일부터 적용됩니다.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>(주)Madon</strong><br/>
                대표자: codingcat06@gmail.com<br/>
                문의: codingcat06@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;