interface NPSloadingProps {
  isLoading: boolean;
}

export default function NPSloading({ isLoading }: NPSloadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-15 flex items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        <img src="/nps.png" alt="NPS" className="w-32 h-32" />
        <img
          src="/loading_ring.svg"
          alt="Loading"
          className="absolute left-1 w-64 h-64 animate-spin"
        />
      </div>
    </div>
  );
}
