import type { Meta, StoryObj } from "@storybook/react";
import Timer from "../components/ui/Timer";

const meta = {
  title: "UI/Timer",
  component: Timer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: { type: "number", min: 0, max: 10 },
      description: "분",
    },
    sec: {
      control: { type: "number", min: 0, max: 59 },
      description: "초",
    },
    absolute: {
      control: "boolean",
      description: "absolute 포지셔닝 사용 여부",
    },
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 3,
    sec: 0,
    absolute: false,
  },
};

export const ThirtySeconds: Story = {
  args: {
    min: 0,
    sec: 30,
    absolute: false,
  },
};

export const FiveMinutes: Story = {
  args: {
    min: 5,
    sec: 0,
    absolute: false,
  },
};

export const OneMinuteThirtySeconds: Story = {
  args: {
    min: 1,
    sec: 30,
    absolute: false,
  },
};

export const AlmostExpired: Story = {
  args: {
    min: 0,
    sec: 10,
    absolute: false,
  },
};

export const InAbsolutePosition: Omit<Story, "args"> = {
  render: () => (
    <div className="relative w-96 h-32 border border-gray-300 rounded-lg p-4">
      <h3 className="font-semibold">인증 코드 입력</h3>
      <p className="text-sm text-gray-600">남은 시간 내에 입력해주세요</p>
      <Timer min={2} sec={30} absolute={true} />
    </div>
  ),
};

export const InForm: Omit<Story, "args"> = {
  render: () => (
    <div className="w-96 border border-gray-300 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">인증번호 입력</h3>
        <Timer min={3} sec={0} absolute={false} />
      </div>
      <input
        type="text"
        placeholder="인증번호 6자리"
        className="w-full p-3 border rounded-md"
        maxLength={6}
      />
      <button className="w-full bg-olo text-white p-3 rounded-md">확인</button>
    </div>
  ),
};
