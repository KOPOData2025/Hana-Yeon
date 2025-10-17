import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold mb-2">첫 번째 탭</h3>
          <p className="text-sm text-gray-600">첫 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold mb-2">두 번째 탭</h3>
          <p className="text-sm text-gray-600">두 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold mb-2">세 번째 탭</h3>
          <p className="text-sm text-gray-600">세 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const AccountTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="transactions">거래내역</TabsTrigger>
        <TabsTrigger value="settings">설정</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-6 border rounded-md space-y-4">
          <h3 className="text-lg font-semibold">계좌 개요</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">현재 잔액</p>
              <p className="text-2xl font-bold">₩1,234,567</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이번 달 지출</p>
              <p className="text-2xl font-bold">₩456,789</p>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="transactions">
        <div className="p-6 border rounded-md">
          <h3 className="text-lg font-semibold mb-4">최근 거래</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">스타벅스</span>
              <span className="text-sm font-semibold">-₩4,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">급여 입금</span>
              <span className="text-sm font-semibold text-green-600">
                +₩3,000,000
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">편의점</span>
              <span className="text-sm font-semibold">-₩12,000</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-6 border rounded-md">
          <h3 className="text-lg font-semibold mb-4">계좌 설정</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">알림 받기</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">자동이체 설정</span>
            </label>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="login" className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">로그인</TabsTrigger>
        <TabsTrigger value="signup">회원가입</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="p-4 border rounded-md space-y-3">
          <input
            type="email"
            placeholder="이메일"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-2 border rounded"
          />
          <button className="w-full p-2 bg-olo text-white rounded">
            로그인
          </button>
        </div>
      </TabsContent>
      <TabsContent value="signup">
        <div className="p-4 border rounded-md space-y-3">
          <input
            type="text"
            placeholder="이름"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="이메일"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-2 border rounded"
          />
          <button className="w-full p-2 bg-olo text-white rounded">
            가입하기
          </button>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
