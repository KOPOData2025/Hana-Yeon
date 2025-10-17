import type { Meta, StoryObj } from "@storybook/react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const meta = {
  title: "UI/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContainer: Story = {
  render: () => (
    <div className="h-64 bg-gray-50 relative">
      <LoadingSpinner />
    </div>
  ),
};
