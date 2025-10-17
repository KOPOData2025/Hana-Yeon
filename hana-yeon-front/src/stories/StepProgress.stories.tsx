import type { Meta, StoryObj } from "@storybook/react";
import StepProgress from "../components/ui/StepProgress";

const meta = {
  title: "UI/StepProgress",
  component: StepProgress,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    currentStep: {
      control: { type: "number", min: 1, max: 5 },
      description: "현재 진행 중인 단계",
    },
    totalSteps: {
      control: { type: "number", min: 2, max: 10 },
      description: "전체 단계 수",
    },
  },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
    stepTitle: "기본 정보 입력",
    description: "고객님의 기본 정보를 입력해주세요.",
  },
};

export const Step2of4: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    stepTitle: "상품 선택",
    description: "원하시는 금융 상품을 선택해주세요.",
  },
};

export const Step3of4: Story = {
  args: {
    currentStep: 3,
    totalSteps: 4,
    stepTitle: "약관 동의",
    description: "필수 약관에 동의해주세요.",
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 4,
    totalSteps: 4,
    stepTitle: "신청 완료",
    description: "모든 절차가 완료되었습니다.",
  },
};

export const WithoutDescription: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    stepTitle: "본인 인증",
  },
};

export const ThreeSteps: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    stepTitle: "계좌 개설",
  },
};

export const FiveSteps: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    stepTitle: "중간 단계",
    description: "거의 다 왔습니다!",
  },
};

export const AllSteps: Omit<Story, "args"> = {
  render: () => (
    <div className="space-y-8">
      <StepProgress
        currentStep={1}
        totalSteps={4}
        stepTitle="1단계"
        description="첫 번째 단계입니다."
      />
      <StepProgress
        currentStep={2}
        totalSteps={4}
        stepTitle="2단계"
        description="두 번째 단계입니다."
      />
      <StepProgress
        currentStep={3}
        totalSteps={4}
        stepTitle="3단계"
        description="세 번째 단계입니다."
      />
      <StepProgress
        currentStep={4}
        totalSteps={4}
        stepTitle="4단계"
        description="마지막 단계입니다."
      />
    </div>
  ),
};
