interface SetCarrierProps {
  selected: string;
  setSelected: (carrier: string) => void;
  className?: string;
}

export default function SetCarrier({ selected, setSelected }: SetCarrierProps) {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-gray-700 dark:text-white">통신사 선택</label>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setSelected("SKT")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "SKT"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          SKT
        </button>
        <button
          type="button"
          onClick={() => setSelected("LGU+")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "LGU+"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          LGU+
        </button>
        <button
          type="button"
          onClick={() => setSelected("KT")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "KT"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          KT
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setSelected("SKT 알뜰폰")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "SKT 알뜰폰"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          SKT 알뜰폰
        </button>
        <button
          type="button"
          onClick={() => setSelected("LGU+ 알뜰폰")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "LGU+ 알뜰폰"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          LGU+ 알뜰폰
        </button>
        <button
          type="button"
          onClick={() => setSelected("KT 알뜰폰")}
          className={`p-3 border bg-white rounded-lg text-sm text-gray-400 font-medium transition-colors ${
            selected === "KT 알뜰폰"
              ? "text-primary border-primary"
              : "text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          KT 알뜰폰
        </button>
      </div>
    </div>
  );
}
