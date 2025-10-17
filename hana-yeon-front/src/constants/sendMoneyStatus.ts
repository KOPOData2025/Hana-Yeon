export const sendMoneyStatus = {
  loading: {
    src: "/flyingMoney.gif",
    text: "돈을 보내고 있어요!",
  },
  success: {
    src: "https://static.toss.im/3d-emojis/u1FA99-apng.png",
    text: "잘 보냈어요!",
  },
  error: {
    src: "https://static.toss.im/tds/icon/png/4x/icn-warning-color.png",
    text: "송금에 실패했어요",
  },
} as const;
