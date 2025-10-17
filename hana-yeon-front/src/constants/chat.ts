import type { TChatMessage } from "@/types";

export const WELCOME_CHAT_MESSAGE = {
  id: "welcome",
  question: "",
  answer:
    "안녕하세요 👋\n 하나연(緣) 연금·투자 챗봇이에요.\n\n✔️ 국민연금·퇴직연금·연금저축 차이가 궁금하다면?\n✔️ 세액공제 혜택을 제대로 받고 싶다면?\n✔️ 내게 맞는 하나은행 연금 상품을 찾아보고 싶다면?\n\n저에게 물어봐 주세요. 맞춤 답변과 함께 바로 가입까지 이어드릴게요.",
  contents: [
    {
      type: "text",
      text: "안녕하세요 👋\n 하나연(緣) 연금·투자 챗봇이에요.\n\n✔️ 국민연금·퇴직연금·연금저축 차이가 궁금하다면?\n✔️ 세액공제 혜택을 제대로 받고 싶다면?\n✔️ 내게 맞는 하나은행 연금 상품을 찾아보고 싶다면?\n\n저에게 물어봐 주세요. 맞춤 답변과 함께 바로 가입까지 이어드릴게요.",
    },
  ],
  timestamp: Date.now(),
};

export const PENSION_CHAT_DATA: TChatMessage[] = [
  {
    id: "types",
    question: "연금 종류",
    answer:
      "연금에는 크게 국민연금, 퇴직연금, 개인연금이 있어요. 국민연금은 국가에서 보장해주고, 퇴직연금은 회사에서 적립해주며, 개인연금은 스스로 준비하는 상품이에요.",
    contents: [
      {
        type: "text",
        text: "연금에는 크게 국민연금, 퇴직연금, 개인연금이 있어요. 국민연금은 국가에서 보장해주고, 퇴직연금은 회사에서 적립해주며, 개인연금은 스스로 준비하는 상품이에요.",
      },
    ],
    options: [
      { label: "국민연금은 뭐에요?", nextId: "nps" },
      { label: "퇴직연금은 뭐에요?", nextId: "retirement" },
      { label: "연금저축은 뭐에요?", nextId: "saving" },
    ],
  },
  {
    id: "nps",
    question: "국민연금",
    answer:
      "국민연금은 국가가 운영하는 공적연금이에요. 10년 이상 가입하면 65세부터 매달 연금을 받을 수 있어요.",
    contents: [
      {
        type: "text",
        text: "국민연금은 국가가 운영하는 공적연금이에요. 10년 이상 가입하면 65세부터 매달 연금을 받을 수 있어요.",
      },
    ],
    options: [
      { label: "퇴직연금은 뭐에요?", nextId: "retirement" },
      { label: "연금저축은 뭐에요?", nextId: "saving" },
    ],
  },
  {
    id: "retirement",
    question: "퇴직연금이란",
    answer:
      "퇴직연금은 근로자의 퇴직금을 회사가 대신 적립하고, 근로자가 직접 운용하거나 은퇴 후 연금으로 받을 수 있게 한 제도에요. 유형은 DB형, DC형, IRP로 나뉘어요.",
    contents: [
      {
        type: "text",
        text: "퇴직연금은 근로자의 퇴직금을 회사가 대신 적립하고, 근로자가 직접 운용하거나 은퇴 후 연금으로 받을 수 있게 한 제도에요. 유형은 DB형, DC형, IRP로 나뉘어요.",
      },
    ],
    options: [
      { label: "DB형은 뭐에요?", nextId: "explainDB" },
      { label: "DC형은 뭐에요?", nextId: "explainDC" },
      { label: "IRP는 뭐에요?", nextId: "explainIRP" },
    ],
  },
  {
    id: "explainDB",
    question: "DB형",
    answer:
      "DB형(확정급여형)은 퇴직 시 받을 금액이 미리 정해져 있어요. 운용은 회사가 하고, 근로자는 결과에 영향을 받지 않아요.",
    contents: [
      {
        type: "text",
        text: "DB형(확정급여형)은 퇴직 시 받을 금액이 미리 정해져 있어요. 운용은 회사가 하고, 근로자는 결과에 영향을 받지 않아요.",
      },
    ],
    options: [
      { label: "DC형은 뭐에요?", nextId: "explainDC" },
      { label: "IRP는 뭐에요?", nextId: "explainIRP" },
    ],
  },
  {
    id: "explainDC",
    question: "DC형",
    answer:
      "DC형(확정기여형)은 회사가 매년 일정 금액을 계좌에 넣어주고, 근로자가 직접 운용해요. 투자 성과에 따라 받을 금액이 달라져요.",
    contents: [
      {
        type: "text",
        text: "DC형(확정기여형)은 회사가 매년 일정 금액을 계좌에 넣어주고, 근로자가 직접 운용해요. 투자 성과에 따라 받을 금액이 달라져요.",
      },
    ],
    options: [
      { label: "DB형은 뭐에요?", nextId: "explainDB" },
      { label: "IRP는 뭐에요?", nextId: "explainIRP" },
    ],
  },
  {
    id: "explainIRP",
    question: "IRP",
    answer:
      "IRP(개인형퇴직연금)는 퇴직 시 받은 퇴직금을 본인 명의의 IRP 계좌로 옮겨두거나, 추가로 납입해 운용할 수 있는 개인 계좌에요. 연 최대 900만원의 세액공제를 받을 수 있어 세금 혜택이 커요.",
    contents: [
      {
        type: "text",
        text: "IRP(개인형퇴직연금)는 퇴직 시 받은 퇴직금을 본인 명의의 IRP 계좌로 옮겨두거나, 추가로 납입해 운용할 수 있는 개인 계좌에요. 연 최대 900만원의 세액공제를 받을 수 있어 세금 혜택이 커요.",
      },
    ],
    options: [
      { label: "DB형은 뭐에요?", nextId: "explainDB" },
      { label: "DC형은 뭐에요?", nextId: "explainDC" },
    ],
  },
  {
    id: "saving",
    question: "연금저축이란",
    answer:
      "연금저축은 개인이 스스로 가입하는 노후 준비 상품이에요. 매년 납입액의 최대 600만원까지 세액공제를 받을 수 있어 세금 혜택이 커요. 55세 이후부터 연금 형태로 수령할 수 있어요.",
    contents: [
      {
        type: "text",
        text: "연금저축은 개인이 스스로 가입하는 노후 준비 상품이에요. 매년 납입액의 최대 600만원까지 세액공제를 받을 수 있어 세금 혜택이 커요. 55세 이후부터 연금 형태로 수령할 수 있어요.",
      },
    ],
    options: [
      { label: "세액공제는 얼마나 되나요?", nextId: "tax" },
      { label: "수령 나이는 언제부터에요?", nextId: "age" },
      { label: "하나은행 상품은 뭐가 있나요?", nextId: "product" },
    ],
  },
  {
    id: "isa",
    question: "ISA",
    answer:
      "ISA(개인종합자산관리계좌)는 이자/배당 소득에 비과세 혜택을 주는 만능 절세 통장이에요. 예금, 펀드 등을 통합 관리하며, 만기 후 연금 전환 시 추가 세액공제까지 받을 수 있어요.",
    contents: [
      {
        type: "text",
        text: "ISA(개인종합자산관리계좌)는 이자/배당 소득에 비과세 혜택을 주는 만능 절세 통장이에요. 예금, 펀드 등을 통합 관리하며, 만기 후 연금 전환 시 추가 세액공제까지 받을 수 있어요.",
      },
    ],
    options: [
      { label: "ISA 만기 자금은 어떻게 활용해요?", nextId: "isa_rollover" },
    ],
  },
  {
    id: "isa_rollover",
    question: "ISA 만기 자금은 어떻게 활용해요?",
    answer:
      "연금저축이나 IRP로 이전하면 연 납입 한도(1,800만 원)에 상관없이 납입 가능하며, 추가 세액공제 혜택도 받을 수 있어요.",
    contents: [
      {
        type: "text",
        text: "연금저축이나 IRP로 이전하면 연 납입 한도(1,800만 원)에 상관없이 납입 가능하며, 추가 세액공제 혜택도 받을 수 있어요.",
      },
    ],
  },
  {
    id: "tax",
    question: "세액공제",
    answer:
      "연금저축(최대 600만원)과 IRP(최대 900만원)을 합쳐 연간 총 900만원 한도까지 세액공제 혜택을 받을 수 있어요. 세율에 따라 최대 148.5만원까지 연말정산 환급이 가능합니다.",
    contents: [
      {
        type: "text",
        text: "연금저축(최대 600만원)과 IRP(최대 900만원)을 합쳐 연간 총 900만원 한도까지 세액공제 혜택을 받을 수 있어요. 세율에 따라 최대 148.5만원까지 연말정산 환급이 가능합니다.",
      },
    ],
  },
  {
    id: "age",
    question: "수령 나이",
    answer:
      "국민연금은 65세부터 받을 수 있고, 퇴직연금과 연금저축은 55세부터 수령이 가능해요.",
    contents: [
      {
        type: "text",
        text: "국민연금은 65세부터 받을 수 있고, 퇴직연금과 연금저축은 55세부터 수령이 가능해요.",
      },
    ],
    options: [{ label: "저는 준비하기에 늦은 것 같아요", nextId: "late" }],
  },
  {
    id: "reason",
    question: "어려서 연금저축을 잘 몰라요",
    answer:
      "지금 시작하는 게 가장 유리해요! 젊을 때 넣는 돈은 복리 효과로 앞으로 몇 배가 돼요. 일반 예적금과 달리 세액공제까지 확정적으로 받으니, 빨리 시작해보세요.",
    contents: [
      {
        type: "text",
        text: "지금 시작하는 게 가장 유리해요! 젊을 때 넣는 돈은 복리 효과로 앞으로 몇 배가 돼요. 일반 예적금과 달리 세액공제까지 확정적으로 받으니, 빨리 시작해보세요.",
      },
    ],
    options: [{ label: "세액공제는 얼마나 되나요?", nextId: "tax" }],
  },

  {
    id: "late",
    question: "가입하긴 늦은 것 같아요",
    answer:
      "연금은 언제 시작해도 늦지 않아요 👍 나이에 따라 전략이 조금 달라질 뿐이에요.",
    contents: [
      {
        type: "text",
        text: "연금은 언제 시작해도 늦지 않아요 👍 나이에 따라 전략이 조금 달라질 뿐이에요.",
      },
    ],
    options: [
      { label: "20~30대는 어떤가요?", nextId: "late-young" },
      { label: "40~50대는 어떤가요?", nextId: "late-middle" },
      { label: "60대 이후는 어떤가요?", nextId: "late-senior" },
    ],
  },
  {
    id: "late-young",
    question: "20~30대는 어떤가요?",
    answer:
      "복리 효과를 가장 크게 누릴 수 있는 시기예요. 적은 금액을 오래 불려 큰 연금 자산을 만들 수 있어요.",
    contents: [
      {
        type: "text",
        text: "복리 효과를 가장 크게 누릴 수 있는 시기예요. 적은 금액을 오래 불려 큰 연금 자산을 만들 수 있어요.",
      },
    ],
    options: [
      { label: "40~50대는 어떤가요?", nextId: "late-middle" },
      { label: "60대 이후는 어떤가요?", nextId: "late-senior" },
    ],
  },
  {
    id: "late-middle",
    question: "40~50대는 어떤가요?",
    answer:
      "소득이 높아 세액공제 혜택을 크게 활용할 수 있어요. 은퇴 전까지도 10년 이상 적립할 시간이 충분하고, 만기기간이 3년인 ISA계좌를 운용할 수도 있어요.",
    contents: [
      {
        type: "text",
        text: "소득이 높아 세액공제 혜택을 크게 활용할 수 있어요. 은퇴 전까지도 10년 이상 적립할 시간이 충분하고, 만기기간이 3년인 ISA계좌를 운용할 수도 있어요.",
      },
    ],
    options: [{ label: "ISA는 뭐에요?", nextId: "isa" }],
  },
  {
    id: "late-senior",
    question: "60대 이후는 어떤가요?",
    answer:
      "연금저축 수령시기가 지났지만, ISA 같은 절세계좌는 만기기간이 3년이라 지금도 시작 가능해요.",
    contents: [
      {
        type: "text",
        text: "연금저축 수령시기가 지났지만, ISA 같은 절세계좌는 만기기간이 3년이라 지금도 시작 가능해요.",
      },
    ],
    options: [{ label: "ISA는 뭐에요?", nextId: "isa" }],
  },

  {
    id: "two_pensions",
    question: "연금저축을 두 개 만드는 이유",
    answer:
      "중도인출 때문이에요. 세액공제 받는 통장과 안 받는 통장을 분리하면, 비상 상황 시 패널티(기타소득세 16.5%) 없이 아무때나 돈을 찾을 수 있어요.",
    contents: [
      {
        type: "text",
        text: "중도인출 때문이에요. 세액공제 받는 통장과 안 받는 통장을 분리하면, 비상 상황 시 패널티(기타소득세 16.5%) 없이 아무때나 돈을 찾을 수 있어요.",
      },
    ],
    options: [
      { label: "ISA 만기 자금도 분리해야 하나요?", nextId: "isa_rollover" },
    ],
  },
].map((item) => ({ ...item, contents: [{ type: "text", text: item.answer }] }));

export const INITIAL_CHAT_CHIPS = PENSION_CHAT_DATA.filter(({ id }) =>
  [
    "retirement",
    "saving",
    "late",
    "age",
    "reason",
    "two_pensions",
    "isa",
  ].includes(id)
)
  .map((item, idx) => ({ idx, ...item }))
  .sort((a, b) => a.idx - b.idx);
