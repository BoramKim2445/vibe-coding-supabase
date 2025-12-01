'use client';

import { useRouter } from 'next/navigation';
import { LogIn, PenSquare, Sparkles } from "lucide-react";
import { useMagazines } from './index.binding.hook';

interface ArticleItem {
  imageUrl: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

const articleData: ArticleItem[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjA5ODI4MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "인공지능",
    title: "2025년 AI 트렌드: 생성형 AI의 진화",
    summary: "ChatGPT를 넘어서는 차세대 AI 기술과 산업 전반의 변화를 살펴봅니다",
    content: "생성형 AI는 이제 단순한 텍스트 생성을 넘어 이미지, 동영상, 음악 등 다양한 콘텐츠를 창조하고 있습니다. 2025년에는 멀티모달 AI가 주류가 되면서 여러 형태의 데이터를 동시에 처리하고 이해하는 능력이 크게 향상될 것으로 예상됩니다. 기업들은 AI를 활용해 생산성을 높이고, 개인화된 고객 경험을 제공하며, 새로운 비즈니스 모델을 창출하고 있습니다. 특히 의료, 교육, 금융 분야에서 AI의 활용이 더욱 확대되며 우리 삶의 질을 개선하는 데 기여할 것입니다.",
    tags: ["생성형AI", "멀티모달", "ChatGPT", "머신러닝"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NjEwMDM5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "웹개발",
    title: "React 19와 Next.js 15: 프론트엔드의 새로운 시대",
    summary: "최신 프론트엔드 프레임워크의 혁신적인 기능과 개발자 경험 개선을 알아봅니다",
    content: "React 19는 서버 컴포넌트와 액션을 통해 풀스택 개발 경험을 완전히 새롭게 정의했습니다. 자동 메모이제이션, 개선된 하이드레이션, 그리고 더 나은 에러 처리로 개발자들은 더 빠르고 안정적인 애플리케이션을 구축할 수 있게 되었습니다. Next.js 15는 이러한 React의 새로운 기능들을 완벽하게 통합하며, 부분 사전 렌더링과 향상된 캐싱 전략을 도입했습니다. 이제 개발자들은 더 적은 코드로 더 많은 것을 구현할 수 있으며, 사용자들은 더 빠른 로딩 속도와 부드러운 인터랙션을 경험할 수 있습니다.",
    tags: ["React", "Next.js", "서버컴포넌트", "프론트엔드"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3NjEwMjQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "클라우드",
    title: "멀티클라우드 전략: 기업의 필수 선택",
    summary: "AWS, Azure, GCP를 활용한 효율적인 클라우드 인프라 구축 방법",
    content: "현대 기업들은 단일 클라우드 제공자에 의존하는 것의 위험성을 인식하고 멀티클라우드 전략을 채택하고 있습니다. 각 클라우드 플랫폼의 장점을 활용하면서 벤더 종속을 피할 수 있기 때문입니다. AWS의 폭넓은 서비스 생태계, Azure의 엔터프라이즈 통합, GCP의 데이터 분석 및 AI 기능을 조합하면 최적의 솔루션을 구축할 수 있습니다. 쿠버네티스와 같은 컨테이너 오케스트레이션 도구를 사용하면 여러 클라우드 환경에서 일관된 애플리케이션 배포가 가능합니다.",
    tags: ["AWS", "Azure", "GCP", "쿠버네티스"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1691435828932-911a7801adfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbmV0d29ya3xlbnwxfHx8fDE3NjEwMTA1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "보안",
    title: "제로 트러스트 보안: 더 이상 선택이 아닌 필수",
    summary: "클라우드 시대의 새로운 보안 패러다임과 구현 전략을 소개합니다",
    content: "전통적인 경계 기반 보안 모델은 원격 근무와 클라우드 서비스의 확산으로 한계를 드러냈습니다. 제로 트러스트는 '절대 신뢰하지 말고 항상 검증하라'는 원칙 하에 모든 사용자와 디바이스를 검증합니다. 다단계 인증, 최소 권한 원칙, 마이크로세그멘테이션을 통해 공격 표면을 최소화하고 데이터 유출을 방지할 수 있습니다. 최근 증가하는 랜섬웨어 공격과 공급망 보안 위협에 대응하기 위해 많은 기업들이 제로 트러스트 아키텍처로 전환하고 있으며, 이는 더 이상 미룰 수 없는 필수 과제가 되었습니다.",
    tags: ["제로트러스트", "사이버보안", "MFA", "랜섬웨어"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzYwOTg0NzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "모바일",
    title: "크로스 플랫폼 개발의 미래: Flutter vs React Native",
    summary: "하나의 코드로 iOS와 Android를 동시에 개발하는 최신 기술 비교",
    content: "모바일 앱 개발 시장에서 크로스 플랫폼 프레임워크는 개발 비용과 시간을 크게 절감시켜줍니다. Flutter는 구글이 개발한 프레임워크로 뛰어난 성능과 아름다운 UI를 제공하며, Dart 언어를 사용합니다. React Native는 페이스북이 만든 프레임워크로 자바스크립트 기반이며, 웹 개발자들이 쉽게 접근할 수 있습니다. 두 프레임워크 모두 핫 리로드 기능으로 빠른 개발 사이클을 지원하며, 네이티브 모듈과의 통합도 가능합니다. 프로젝트의 요구사항과 팀의 기술 스택에 따라 적절한 선택이 필요합니다.",
    tags: ["Flutter", "ReactNative", "크로스플랫폼", "모바일앱"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjA5NjE1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "데이터사이언스",
    title: "빅데이터 분석의 새로운 지평: 실시간 처리의 중요성",
    summary: "Apache Kafka와 Spark를 활용한 대규모 데이터 스트리밍 분석",
    content: "현대 비즈니스에서 데이터는 가장 중요한 자산입니다. 하지만 배치 처리만으로는 빠르게 변화하는 시장에 대응하기 어렵습니다. Apache Kafka는 초당 수백만 건의 이벤트를 처리할 수 있는 분산 스트리밍 플랫폼으로, 실시간 데이터 파이프라인 구축의 핵심입니다. Apache Spark는 대규모 데이터 처리를 위한 통합 분석 엔진으로, 배치와 스트리밍 처리를 모두 지원합니다. 이 두 기술을 결합하면 실시간으로 데이터를 수집, 처리, 분석하여 즉각적인 비즈니스 인사이트를 얻을 수 있습니다. 전자상거래의 실시간 추천 시스템, 금융의 이상 거래 탐지, IoT 센서 데이터 분석 등 다양한 분야에서 활용되고 있습니다.",
    tags: ["빅데이터", "Kafka", "Spark", "실시간분석"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1666816943035-15c29931e975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjA5OTc2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "블록체인",
    title: "Web3의 현실: 블록체인이 바꾸는 인터넷",
    summary: "탈중앙화 기술이 가져올 디지털 소유권과 프라이버시의 혁명",
    content: "Web3는 블록체인 기술을 기반으로 한 탈중앙화된 인터넷의 새로운 비전입니다. 기존 Web2에서는 대형 플랫폼 기업들이 사용자 데이터와 콘텐츠를 통제했지만, Web3에서는 사용자가 자신의 데이터와 디지털 자산을 직접 소유하고 관리합니다. 스마트 컨트랙트를 통해 중개자 없이 투명하고 자동화된 거래가 가능하며, NFT는 디지털 아트와 지적재산권에 새로운 가치를 부여했습니다. 탈중앙화 금융(DeFi)은 전통적인 금융 서비스를 누구나 접근 가능하게 만들고 있습니다. 물론 확장성, 사용성, 규제 문제 등 해결해야 할 과제도 많지만, Web3는 인터넷의 미래를 재정의하고 있습니다.",
    tags: ["Web3", "블록체인", "NFT", "DeFi"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjEwMjUzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "DevOps",
    title: "DevOps에서 Platform Engineering으로의 전환",
    summary: "개발자 경험을 혁신하는 내부 개발자 플랫폼 구축 가이드",
    content: "DevOps는 개발과 운영의 경계를 허물며 큰 성공을 거두었지만, 도구와 프로세스의 복잡성이 증가하면서 새로운 문제가 발생했습니다. Platform Engineering은 이러한 복잡성을 추상화하고 셀프서비스 플랫폼을 제공함으로써 개발자가 비즈니스 로직에 집중할 수 있게 합니다. 내부 개발자 플랫폼(IDP)은 인프라 프로비저닝, CI/CD 파이프라인, 모니터링, 보안을 통합된 경험으로 제공합니다. Backstage와 같은 오픈소스 플랫폼을 활용하거나 자체 솔루션을 구축할 수 있습니다. 골든 패스를 정의하고, 개발자 포털을 구축하며, 플랫폼을 제품처럼 운영하는 것이 핵심입니다.",
    tags: ["DevOps", "Platform Engineering", "IDP", "개발자경험"]
  }
];

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "인공지능": "magazine-category-ai",
    "웹개발": "magazine-category-web",
    "클라우드": "magazine-category-cloud",
    "보안": "magazine-category-security",
    "모바일": "magazine-category-mobile",
    "데이터사이언스": "magazine-category-data",
    "블록체인": "magazine-category-blockchain",
    "DevOps": "magazine-category-devops",
  };
  
  return colorMap[category] || "magazine-category-default";
};

export default function GlossaryCards() {
  const router = useRouter();
  const { magazines, loading, error } = useMagazines();

  // 카드 클릭 핸들러
  const handleCardClick = (id: string) => {
    router.push(`/magazines/${id}`);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="magazine-container">
        <div className="magazine-header">
          <h1>IT 매거진</h1>
          <p className="magazine-subtitle">최신 기술 트렌드와 인사이트를 전합니다</p>
        </div>
        <div className="text-center py-20">
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="magazine-container">
        <div className="magazine-header">
          <h1>IT 매거진</h1>
          <p className="magazine-subtitle">최신 기술 트렌드와 인사이트를 전합니다</p>
        </div>
        <div className="text-center py-20">
          <p className="text-red-600">에러가 발생했습니다: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-container">
      <div className="magazine-header">
        <h1>IT 매거진</h1>
        <p className="magazine-subtitle">최신 기술 트렌드와 인사이트를 전합니다</p>
        <div className="magazine-header-actions">
          <button 
            className="magazine-header-button magazine-header-button-ghost"
            onClick={() => router.push('/auth/login')}
          >
            <LogIn className="magazine-button-icon" />
            <span className="magazine-button-text">로그인</span>
          </button>
          <button 
            className="magazine-header-button magazine-header-button-primary"
            onClick={() => router.push('/magazines/new')}
          >
            <PenSquare className="magazine-button-icon" />
            <span className="magazine-button-text">글쓰기</span>
          </button>
          <button 
            className="magazine-header-button magazine-header-button-payment"
            onClick={() => router.push('/payments')}
          >
            <Sparkles className="magazine-button-icon" />
            <span className="magazine-button-text">구독하기</span>
          </button>
        </div>
      </div>
      
      <div className="magazine-grid">
        {magazines.map((magazine) => (
          <article 
            key={magazine.id} 
            className="magazine-card cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleCardClick(magazine.id)}
          >
            <div className="magazine-card-image">
              <img 
                src={magazine.image_url} 
                alt={magazine.title}
                className="w-full h-full object-cover"
              />
              <div className={`magazine-card-category ${getCategoryColor(magazine.category)}`}>
                {magazine.category}
              </div>
            </div>
            
            <div className="magazine-card-content">
              <h2 className="magazine-card-title">{magazine.title}</h2>
              <p className="magazine-card-summary">{magazine.description}</p>
              
              <div className="magazine-card-tags">
                {magazine.tags && magazine.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="magazine-tag">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
