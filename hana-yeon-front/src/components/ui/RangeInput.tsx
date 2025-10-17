interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  id: string;
  min: number;
  max: number;
  showLabel?: boolean;
}

export default function RangeInput({
  value,
  onChange,
  id,
  min,
  max,
  showLabel = true,
}: RangeInputProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
      {showLabel && (
        <div className="flex items-center  mb-2">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            납부 종료 희망 연령:
          </label>
          <span className="text-olo text-sm font-semibold ml-1">{value}세</span>
        </div>
      )}
      <div className="flex items-center space-x-4 px-1">
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {min}세
        </span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700 touch-pan-y"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {max}세
        </span>
      </div>
    </div>
  );
}
