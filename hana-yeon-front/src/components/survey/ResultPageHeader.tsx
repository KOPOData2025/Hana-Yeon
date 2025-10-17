import { Lottie } from "tosslib";

export function ResultPageHeader() {
  return (
    <>
      <div className="px-6 text-center">
        <Lottie
          src="https://static.toss.im/lotties-common/check-spot.json"
          className="w-32 h-32 mx-auto"
          loop={false}
        />
        <h1 className="text-2xl font-bold text-olo dark:text-brand pt-5">
          투자 성향 진단이
          <br />
          완료되었어요!
        </h1>
      </div>
    </>
  );
}
