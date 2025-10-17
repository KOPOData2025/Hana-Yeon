import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import Button from "../components/ui/Button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드에 대한 설명입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드의 주요 콘텐츠 영역입니다.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>알림 수신 방법을 선택하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>이메일 또는 SMS로 알림을 받을 수 있습니다.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1 text-gray-600">
          취소
        </Button>
        <Button className="flex-1">저장</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>하나은행 연금펀드</CardTitle>
        <CardDescription>목돈 마련의 첫걸음</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">금리</span>
            <span className="font-semibold">3.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">기간</span>
            <span className="font-semibold">12개월</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">월 납입액</span>
            <span className="font-semibold">100,000원</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">자세히 보기</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatisticsCard: Story = {
  render: () => (
    <Card className="w-[280px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">월 지출</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-olo">₩1,234,567</div>
        <p className="text-xs text-gray-600 mt-2">전월 대비 -15.3%</p>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>카드 1</CardTitle>
          <CardDescription>첫 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 1</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>카드 2</CardTitle>
          <CardDescription>두 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 2</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>카드 3</CardTitle>
          <CardDescription>세 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 3</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>카드 4</CardTitle>
          <CardDescription>네 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 4</p>
        </CardContent>
      </Card>
    </div>
  ),
};
