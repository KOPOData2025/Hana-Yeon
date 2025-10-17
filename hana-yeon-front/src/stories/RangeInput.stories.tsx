import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RangeInput from "../components/ui/RangeInput";

const meta = {
  title: "UI/RangeInput",
  component: RangeInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Omit<Story, "args"> = {
  render: () => {
    const [value, setValue] = useState(65);
    return (
      <div className="w-full max-w-md">
        <RangeInput
          id="age-range"
          value={value}
          onChange={setValue}
          min={30}
          max={80}
        />
      </div>
    );
  },
};

export const MinimumAge: Omit<Story, "args"> = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div className="w-full max-w-md">
        <RangeInput
          id="age-range-min"
          value={value}
          onChange={setValue}
          min={30}
          max={80}
        />
      </div>
    );
  },
};

export const MaximumAge: Omit<Story, "args"> = {
  render: () => {
    const [value, setValue] = useState(80);
    return (
      <div className="w-full max-w-md">
        <RangeInput
          id="age-range-max"
          value={value}
          onChange={setValue}
          min={30}
          max={80}
        />
      </div>
    );
  },
};

export const MidAge: Omit<Story, "args"> = {
  render: () => {
    const [value, setValue] = useState(55);
    return (
      <div className="w-full max-w-md">
        <RangeInput
          id="age-range-mid"
          value={value}
          onChange={setValue}
          min={30}
          max={80}
        />
      </div>
    );
  },
};

export const InCard: Omit<Story, "args"> = {
  render: () => {
    const [value, setValue] = useState(60);
    return (
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">보험료 계산</h2>
        <p className="text-sm text-gray-600 mb-4">
          희망하는 납부 종료 연령을 선택해주세요
        </p>
        <RangeInput
          id="insurance-age"
          value={value}
          onChange={setValue}
          min={30}
          max={80}
        />
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">예상 월 납부액</span>
            <span className="text-lg font-bold text-olo">
              ₩{(50000 + (80 - value) * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  },
};

export const MultipleRanges: Omit<Story, "args"> = {
  render: () => {
    const [age, setAge] = useState(65);
    const [amount, setAmount] = useState(500);

    return (
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-bold">대출 신청</h2>

        <div>
          <RangeInput
            id="loan-age"
            value={age}
            onChange={setAge}
            min={30}
            max={80}
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              대출 금액:
            </label>
            <span className="text-olo text-sm font-semibold ml-1">
              {amount}만원
            </span>
          </div>
          <div className="flex items-center space-x-4 px-1">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              100만원
            </span>
            <input
              type="range"
              min={100}
              max={1000}
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">
              1000만원
            </span>
          </div>
        </div>

        <button className="w-full bg-olo text-white py-3 rounded-lg font-semibold">
          신청하기
        </button>
      </div>
    );
  },
};
