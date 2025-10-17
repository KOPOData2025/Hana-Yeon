import type { Meta, StoryObj } from "@storybook/react";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const meta = {
  title: "UI/AnimatedCounter",
  component: AnimatedCounter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onFinish: () => console.log("카운터 완료!"),
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: "bg-gray-100 p-8 rounded-lg",
    onFinish: () => alert("100%에 도달했습니다!"),
  },
};

export const InCard: Story = {
  render: () => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">데이터 분석 중</h2>
      <AnimatedCounter onFinish={() => console.log("완료!")} />
      <p className="text-center text-gray-600 mt-6">잠시만 기다려주세요...</p>
    </div>
  ),
};
