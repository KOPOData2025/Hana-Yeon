import type { Meta, StoryObj } from "@storybook/react";
import ListItem from "../components/ui/ListItem";

const meta = {
  title: "UI/ListItem",
  component: ListItem,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <span className="text-2xl">👤</span>,
    title: "사용자 정보",
    subtitle: "프로필 설정 관리",
  },
};

export const WithoutSubtitle: Story = {
  args: {
    icon: <span className="text-2xl">🏠</span>,
    title: "홈",
  },
};

export const AccountItem: Story = {
  args: {
    icon: <span className="text-2xl">💳</span>,
    title: "내 계좌",
    subtitle: "1002-123-456789",
  },
};

export const SettingsItem: Story = {
  args: {
    icon: <span className="text-2xl">⚙️</span>,
    title: "설정",
    subtitle: "앱 설정 및 환경설정",
  },
};

export const NotificationItem: Story = {
  args: {
    icon: <span className="text-2xl">🔔</span>,
    title: "알림",
    subtitle: "5개의 새로운 알림",
  },
};

export const List: Omit<Story, "args"> = {
  render: () => (
    <div className="w-full max-w-md space-y-2 bg-white p-4 rounded-lg">
      <ListItem
        icon={<span className="text-2xl">👤</span>}
        title="프로필"
        subtitle="개인정보 관리"
        onClick={() => console.log("프로필 클릭")}
      />
      <ListItem
        icon={<span className="text-2xl">💳</span>}
        title="내 계좌"
        subtitle="1002-123-456789"
        onClick={() => console.log("계좌 클릭")}
      />
      <ListItem
        icon={<span className="text-2xl">📊</span>}
        title="거래 내역"
        subtitle="최근 30일 거래"
        onClick={() => console.log("거래내역 클릭")}
      />
      <ListItem
        icon={<span className="text-2xl">⚙️</span>}
        title="설정"
        subtitle="앱 환경설정"
        onClick={() => console.log("설정 클릭")}
      />
      <ListItem
        icon={<span className="text-2xl">🔔</span>}
        title="알림"
        subtitle="3개의 새로운 알림"
        onClick={() => console.log("알림 클릭")}
      />
    </div>
  ),
};

export const BankingMenu: Omit<Story, "args"> = {
  render: () => (
    <div className="w-full max-w-md bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">빠른 메뉴</h2>
      <div className="space-y-2">
        <ListItem
          icon={<span className="text-2xl">💸</span>}
          title="송금"
          subtitle="간편 송금하기"
        />
        <ListItem
          icon={<span className="text-2xl">📝</span>}
          title="대출 신청"
          subtitle="한도 조회 및 신청"
        />
        <ListItem
          icon={<span className="text-2xl">💰</span>}
          title="적금 가입"
          subtitle="목돈 마련 시작"
        />
        <ListItem
          icon={<span className="text-2xl">📈</span>}
          title="자산 분석"
          subtitle="내 자산 한눈에 보기"
        />
      </div>
    </div>
  ),
};
