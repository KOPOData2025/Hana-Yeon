import type { Meta, StoryObj } from "@storybook/react";
import Button from "../components/ui/Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "버튼의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "버튼의 크기",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "기본 버튼",
    variant: "default",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "삭제",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "아웃라인",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "보조 버튼",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "고스트",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "링크 스타일",
    variant: "link",
  },
};

export const Small: Story = {
  args: {
    children: "작은 버튼",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "큰 버튼",
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: "🔍",
  },
};

export const Disabled: Story = {
  args: {
    children: "비활성화",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🔍</Button>
      </div>
    </div>
  ),
};
