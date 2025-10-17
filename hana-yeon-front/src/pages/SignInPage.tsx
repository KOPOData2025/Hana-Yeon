import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
import { useLogin } from "@/hooks/api/auth";
// store
import { useAuthStore } from "@/store";
// constants
import { PATH, shakeVariants } from "@/constants";
// components
import Button from "@/components/ui/Button";
import SecureKeypad from "@/components/ui/SecureKeypad";
import HomeCarousel from "@/components/home/HomeCarousel";

export default function SignInPage() {
  const [phone, setPhone] = useState({ part1: "010", part2: "", part3: "" });
  const [currentStep, setCurrentStep] = useState<"phone" | "password">("phone");
  const [simplePassword, setSimplePassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [animate, setAnimate] = useState("initial");

  const { mutateAsync: signInMutation } = useLogin();
  const { setAccessToken } = useAuthStore();

  const router = useInternalRouter();

  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);
  const fullPhoneNumber = Object.values(phone).join("");

  const isPhoneComplete =
    phone.part1.length === 3 &&
    phone.part2.length === 4 &&
    phone.part3.length === 4;

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "part1" | "part2" | "part3"
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "");

    setPhone((prev) => ({ ...prev, [part]: numericValue }));

    if (part === "part1" && numericValue.length === 3) {
      phone2Ref.current?.focus();
    } else if (part === "part2" && numericValue.length === 4) {
      phone3Ref.current?.focus();
    }
  };

  const handlePhoneKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    part: "part2" | "part3"
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      if (part === "part2") {
        phone1Ref.current?.focus();
      } else if (part === "part3") {
        phone2Ref.current?.focus();
      }
    }
  };

  const onSimplePasswordChange = useCallback((password: string) => {
    setSimplePassword(password);
  }, []);

  const setOnComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const handleLogin = async () => {
    try {
      const { status, success, message, data } = await signInMutation({
        phoneNo: fullPhoneNumber,
        pin: simplePassword,
      });

      if (status !== 200 || !success) {
        setPinError(true);
        setAnimate("shake");
        setErrorMsg(message);
        setTimeout(() => {
          setAnimate("initial");
        }, 500);
        setIsComplete(false);
      } else if (success && data) {
        setAccessToken(data.accessToken);
        router.push(PATH.HOME);
      }
    } catch (error) {
      console.error(error);
      setPinError(true);
      setAnimate("shake");
      setErrorMsg("PIN번호가 다릅니다.");
      setTimeout(() => {
        setAnimate("initial");
      }, 500);
      setIsComplete(false);
    }
  };

  useEffect(() => {
    if (isComplete) {
      (async () => {
        await handleLogin();
        setResetPassword((prev) => !prev);
      })();
    }
  }, [isComplete]);

  if (currentStep === "password") {
    return (
      <div className="flex flex-col py-6 px-2 my-auto bg-background dark:bg-darkBg">
        <button
          onClick={() => {
            setPinError(false);
            setCurrentStep("phone");
          }}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
        >
          <ChevronLeft size={24} />
        </button>
        <motion.div
          className="text-center relative"
          variants={shakeVariants}
          animate={animate}
          initial="initial"
        >
          <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white mt-10">
            간편 비밀번호를
            <br />
            입력해주세요.
          </h1>
          <div className="w-full mt-8">
            <SecureKeypad
              onPasswordChange={onSimplePasswordChange}
              onComplete={setOnComplete}
              resetPassword={resetPassword}
            />
            {pinError && (
              <div className="absolute top-48 left-1/2 -translate-x-1/2 text-red-500 text-base whitespace-nowrap">
                {errorMsg}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-background dark:bg-darkBg">
      <div className="flex flex-col p-6 relative my-auto">
        <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
          서비스를 이용하려면
          <br />
          로그인하세요.
        </h1>

        <div className="flex-grow mt-8">
          <div className="space-y-6">
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="phone1"
                className="text-gray-700 dark:text-gray-300"
              >
                휴대폰 번호
              </label>
              <div className="flex items-center border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 overflow-hidden">
                <input
                  ref={phone1Ref}
                  id="phone1"
                  type="tel"
                  placeholder="010"
                  value={phone.part1}
                  onChange={(e) => handlePhoneChange(e, "part1")}
                  maxLength={3}
                  className="p-3 w-1/4 text-center outline-none bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-none"
                  autoComplete="off"
                />
                <span className="px-2 text-gray-900 dark:text-gray-200 bg-transparent border-none">
                  -
                </span>
                <input
                  ref={phone2Ref}
                  id="phone2"
                  type="tel"
                  value={phone.part2}
                  onChange={(e) => handlePhoneChange(e, "part2")}
                  onKeyDown={(e) => handlePhoneKeyDown(e, "part2")}
                  maxLength={4}
                  className="p-3 w-1/3 text-center outline-none bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-none"
                  autoComplete="off"
                />
                <span className="px-2 text-gray-900 dark:text-gray-200 bg-transparent border-none">
                  -
                </span>
                <input
                  ref={phone3Ref}
                  id="phone3"
                  type="tel"
                  value={phone.part3}
                  onChange={(e) => handlePhoneChange(e, "part3")}
                  onKeyDown={(e) => handlePhoneKeyDown(e, "part3")}
                  maxLength={4}
                  className="p-3 w-1/3 text-center outline-none bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-none"
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("password")}
              disabled={!isPhoneComplete}
              className="w-full h-12"
            >
              로그인
            </Button>
          </div>

          <div className="mt-8 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              아직 회원이 아니신가요?
              <span
                className="cursor-pointer hover:underline text-primary font-semibold ml-2"
                onClick={() => router.push(PATH.SIGN_UP)}
              >
                회원가입
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
