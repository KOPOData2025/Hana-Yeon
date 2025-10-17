export const SURVEY_QUESTIONS = [
  {
    id: 1,
    type: "binary",
    question: "최근 1년 내 투자 경험이 있습니까?",
    options: {
      yes: {
        label: "예",
        score: 2,
        subQuestions: [
          {
            id: 2,
            type: "binary",
            question: "주식 투자 경험이 있습니까?",
            options: {
              yes: {
                label: "예",
                score: 2,
              },
              no: {
                label: "아니오",
                score: 0,
              },
            },
          },
          {
            id: 3,
            type: "multiple",
            question: "어떤 자산에 투자해보셨나요? (복수 선택 가능)",
            options: [
              {
                label: "주식",
                score: 1,
              },
              {
                label: "채권",
                score: 1,
              },
              {
                label: "부동산",
                score: 1,
              },
              {
                label: "암호화폐",
                score: 1,
              },
            ],
            maxSelect: 3,
          },
        ],
      },
      no: {
        label: "아니오",
        score: 0,
      },
    },
  },
  {
    id: 4,
    type: "binary",
    question: "투자 손실을 경험한 적이 있습니까?",
    options: {
      yes: {
        label: "예",
        score: 1.5,
        subQuestions: [
          {
            id: 5,
            type: "scale",
            question: "손실 경험이 몇 번 있었나요?",
            scaleRange: {
              min: 1,
              max: 5,
              minLabel: "1회",
              maxLabel: "5회 이상",
              scoreUnit: 0.5,
            },
          },
        ],
      },
      no: {
        label: "아니오",
        score: 0,
      },
    },
  },
  {
    id: 6,
    type: "multiple",
    question: "관심 있는 투자 상품을 모두 선택하세요.",
    options: [
      {
        label: "예금/적금",
        score: 1,
      },
      {
        label: "채권",
        score: 1,
      },
      {
        label: "주식",
        score: 1,
      },
      {
        label: "부동산",
        score: 1,
      },
      {
        label: "암호화폐",
        score: 1,
      },
    ],
    maxSelect: 3,
  },
  {
    id: 7,
    type: "multiple",
    question: "투자 시 가장 중요하게 생각하는 요소는? (최대 2개)",
    options: [
      {
        label: "안정성",
        score: 1,
      },
      {
        label: "수익성",
        score: 1,
      },
      {
        label: "유동성",
        score: 1,
      },
    ],
    maxSelect: 2,
  },
  {
    id: 8,
    type: "scale",
    question: "투자에 할애할 수 있는 시간은?",
    scaleRange: {
      min: 1,
      max: 5,
      minLabel: "거의 없음",
      maxLabel: "매일",
      scoreUnit: 1,
    },
  },
  {
    id: 9,
    type: "scale",
    question: "본인의 투자 지식 수준은 어느 정도입니까?",
    scaleRange: {
      min: 1,
      max: 5,
      minLabel: "전혀 없음",
      maxLabel: "전문가",
      scoreUnit: 1,
    },
  },
  {
    id: 10,
    type: "binary",
    question: "투자 결정을 내릴 때 스스로 분석합니까?",
    options: {
      yes: {
        label: "예",
        score: 1,
      },
      no: {
        label: "아니오",
        score: 0,
      },
    },
  },
  {
    id: 11,
    type: "multiple",
    question: "투자 정보는 주로 어디서 얻습니까? (최대 2개)",
    options: [
      {
        label: "뉴스/언론",
        score: 1,
      },
      {
        label: "지인/전문가",
        score: 1,
      },
      {
        label: "온라인 커뮤니티",
        score: 1,
      },
    ],
    maxSelect: 2,
  },
];
