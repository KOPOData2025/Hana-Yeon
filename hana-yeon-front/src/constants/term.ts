interface AgreementItem {
  id: string;
  title: string;
  pdfPath?: string;
  hasDetail?: boolean;
}

export const AGREEMENT_TERMS: AgreementItem[] = [
  {
    id: "all",
    title: "전체 동의",
    pdfPath: "/pdf/know_how_term.pdf",
  },
  {
    id: "term1",
    title: "연금저축계좌 설정약관",
    hasDetail: true,
  },
  {
    id: "term2",
    title: "연금저축계좌 핵심설명서",
    hasDetail: true,
  },
  {
    id: "term3",
    title: "핵심설명서/약관 교부 및 확인사항",
    hasDetail: true,
  },
  {
    id: "term4",
    title: "불법탈법차명거래 금지 설명확인서",
    hasDetail: true,
  },
  {
    id: "term5",
    title: "계좌간 자동이체 약관",
    hasDetail: true,
  },
] as const;
