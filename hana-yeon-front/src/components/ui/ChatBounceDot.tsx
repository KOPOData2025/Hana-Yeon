export default function ChatBounceDot() {
  return (
    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 mb-3">
      <div className="flex items-center space-x-1">
        <div
          className="w-2 h-2 bg-olo rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-olo rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-olo rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
