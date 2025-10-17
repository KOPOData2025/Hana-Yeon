import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
// contexts
import { useSignUpFormContext } from "@/contexts/SignUpContext";
// hooks
import { useTimer } from "@/hooks";
import { useSendSms, useCertifyUserCi } from "@/hooks/api/auth";
// components
import Button from "@/components/ui/Button";
import SetCarrier from "@/components/ui/SetCarrier";
import Timer from "@/components/ui/Timer";
import { X } from "lucide-react";

interface ICombinedInputProps {
  history: any;
}
export default function CombinedInput({ history }: ICombinedInputProps) {
  const { register, watch, setValue } = useSignUpFormContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isNameComplete, setIsNameComplete] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("SKT");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ssn1Ref = useRef<HTMLInputElement>(null);
  const ssn2Ref = useRef<HTMLInputElement>(null);
  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);
  const verifyCodeRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: sendSmsMutation } = useSendSms();
  const { mutateAsync: certifyUserCiMutation } = useCertifyUserCi();

  const { min, sec, isTimerStart, setTimerStart, resetTimer, stopTimer } =
    useTimer(3, 0);

  const { userName, ssn1, ssn2, phone1, phone2, phone3, verifyCode } = watch();

  const phone1Props = register("phone1", {
    required: true,
    pattern: /^\d{3}$/,
  });
  const phone2Props = register("phone2", {
    required: true,
    pattern: /^\d{4}$/,
  });
  const phone3Props = register("phone3", {
    required: true,
    pattern: /^\d{4}$/,
  });

  const isSSNComplete = ssn1.length === 6 && ssn2.length === 7;

  const isPhoneComplete =
    phone1.length === 3 && phone2.length === 4 && phone3.length === 4;

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "phone1" | "phone2" | "phone3"
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "");

    setValue(part, numericValue, { shouldValidate: true });

    if (part === "phone1" && numericValue.length === 3) {
      phone2Ref.current?.focus();
    } else if (part === "phone2" && numericValue.length === 4) {
      phone3Ref.current?.focus();
    }
  };

  const handlePhoneKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    part: "phone2" | "phone3"
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      if (part === "phone2") {
        phone1Ref.current?.focus();
      } else if (part === "phone3") {
        phone2Ref.current?.focus();
      }
    }
  };

  const handleSSNChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "ssn1" | "ssn2"
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "");

    setValue(part, numericValue, { shouldValidate: true });

    if (part === "ssn1" && numericValue.length === 6) {
      ssn2Ref.current?.focus();
    }
  };

  const handleGetVerification = async () => {
    setIsDrawerOpen(true);
    resetTimer();
    setTimerStart(true);

    await sendSmsMutation({
      userName,
      userPhone: `${phone1}-${phone2}-${phone3}`,
      userNum: `${ssn1}-${ssn2}`,
    });
  };

  const sendVerification = useCallback(async () => {
    setIsDrawerOpen(false);
    stopTimer();
    const { success, userCi } = await certifyUserCiMutation({
      userName,
      userPhone: `${phone1}-${phone2}-${phone3}`,
      userNum: `${ssn1}-${ssn2}`,
      verifyCode,
    });
    if (success && userCi != null) {
      setValue("userCi", userCi);
    }
  }, [
    verifyCode,
    stopTimer,
    certifyUserCiMutation,
    userName,
    phone1,
    phone2,
    phone3,
    ssn1,
    ssn2,
  ]);

  useEffect(() => {
    if (currentStep === 1 && isNameComplete) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isSSNComplete) {
      setCurrentStep(3);
    }
  }, [currentStep, isNameComplete, isSSNComplete]);

  useEffect(() => {
    if (currentStep === 2 && isNameComplete && ssn1Ref.current) {
      ssn1Ref.current.focus();
    }
  }, [isNameComplete, currentStep, ssn1Ref]);

  useEffect(() => {
    if (currentStep === 3 && ssn2.length === 7 && phone2Ref.current) {
      phone2Ref.current.focus();
    }
  }, [ssn2, currentStep, phone2Ref]);

  useEffect(() => {
    if (currentStep === 3 && isDrawerOpen && verifyCodeRef.current) {
      verifyCodeRef.current.focus();
    }
  }, [currentStep, isDrawerOpen, verifyCodeRef]);

  return (
    <>
      <div className="w-full flex flex-col p-6 relative">
        <div className="flex-grow">
          <div className="space-y-4 mt-8">
            {/* 휴대폰 번호 입력 - step 3부터 표시 */}
            <div style={{ display: currentStep >= 3 ? "block" : "none" }}>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="phone1" className="dark:text-white">
                  휴대폰 번호를 입력해주세요.
                </label>
                <div className="flex items-center">
                  <input
                    id="phone1"
                    type="tel"
                    placeholder="010"
                    {...phone1Props}
                    ref={(e) => {
                      phone1Props.ref(e);
                      phone1Ref.current = e;
                    }}
                    onChange={(e) => handlePhoneChange(e, "phone1")}
                    maxLength={3}
                    className="p-3 border-y border-l border-gray-300 rounded-s-md w-1/4 text-center outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    autoComplete="off"
                  />
                  <span className="p-3 bg-white border-y border-x-0 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    -
                  </span>
                  <input
                    id="phone2"
                    type="tel"
                    placeholder="1234"
                    {...phone2Props}
                    ref={(e) => {
                      phone2Props.ref(e);
                      phone2Ref.current = e;
                    }}
                    onChange={(e) => handlePhoneChange(e, "phone2")}
                    onKeyDown={(e) => handlePhoneKeyDown(e, "phone2")}
                    maxLength={4}
                    className="p-3 border-y border-gray-300 w-1/3 text-center outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    autoComplete="off"
                  />
                  <span className="p-3 border-gray-300 bg-white border-y dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    -
                  </span>
                  <input
                    id="phone3"
                    type="tel"
                    placeholder="5678"
                    {...phone3Props}
                    ref={(e) => {
                      phone3Props.ref(e);
                      phone3Ref.current = e;
                    }}
                    onChange={(e) => handlePhoneChange(e, "phone3")}
                    onKeyDown={(e) => handlePhoneKeyDown(e, "phone3")}
                    maxLength={4}
                    className="p-3 border-y border-r border-gray-300 rounded-e-md w-1/3 text-center outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="mt-4">
                <SetCarrier
                  selected={selectedCarrier}
                  setSelected={setSelectedCarrier}
                />
              </div>
            </div>

            {/* 주민번호 입력 - step 2부터 표시 */}
            <div
              className="space-y-1.5"
              style={{ display: currentStep >= 2 ? "block" : "none" }}
            >
              <label htmlFor="ssn1" className="dark:text-white">
                주민등록번호
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="ssn1"
                  placeholder="990409"
                  autoComplete="off"
                  {...register("ssn1", {
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                  })}
                  ref={(e) => {
                    register("ssn1").ref(e);
                    ssn1Ref.current = e;
                  }}
                  onChange={(e) => handleSSNChange(e, "ssn1")}
                  className="p-3 border border-gray-300 rounded-md w-full outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  maxLength={6}
                />
                <span className="dark:text-white">-</span>
                <input
                  id="ssn2"
                  type="password"
                  placeholder="•••••••"
                  autoComplete="off"
                  {...register("ssn2", {
                    required: true,
                    minLength: 7,
                    maxLength: 7,
                  })}
                  ref={(e) => {
                    register("ssn2").ref(e);
                    ssn2Ref.current = e;
                  }}
                  onChange={(e) => handleSSNChange(e, "ssn2")}
                  className="p-3 border border-gray-300 rounded-md w-full outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  maxLength={7}
                />
              </div>
            </div>

            {/* 이름 입력 - 항상 표시 */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="dark:text-white">
                이름
              </label>
              <div className="relative">
                <input
                  id="name"
                  placeholder="이름을 입력해 주세요."
                  autoComplete="off"
                  {...register("userName", { required: true })}
                  className="p-3 pr-20 border border-gray-300 rounded-md outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 w-full"
                />
                {currentStep === 1 && userName && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setValue("userName", "", { shouldValidate: true });
                      }}
                      className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center text-white text-xs hover:bg-gray-500 dark:hover:bg-gray-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <Button
                      onClick={() => setIsNameComplete(true)}
                      className="px-3 py-1 text-sm h-8 bg-olo text-white"
                    >
                      확인
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-60 z-40"
                onClick={() => setIsDrawerOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl z-50 shadow-lg"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    인증번호 입력
                  </h2>

                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="verification" className="dark:text-white">
                        인증번호
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="verification"
                          placeholder="인증번호 6자리를 입력하세요"
                          {...register("verifyCode", {
                            required: true,
                            minLength: 6,
                          })}
                          className="p-3 border border-gray-600 rounded-md w-full outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          maxLength={6}
                          disabled={!isTimerStart}
                          ref={(e) => {
                            register("verifyCode").ref(e);
                            verifyCodeRef.current = e;
                          }}
                        />
                        {isTimerStart && <Timer min={min} sec={sec} />}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 text-gray-400"
                        onClick={handleGetVerification}
                        disabled={!isPhoneComplete || !selectedCarrier}
                      >
                        재전송
                      </Button>

                      <Button
                        className="flex-1 h-12"
                        onClick={() => {
                          sendVerification();
                          history.push("SetSimplePin", (prev: any) => ({
                            agreedTerms: prev.agreedTerms,
                            userName,
                            ssn1,
                            ssn2,
                            phone: `${phone1}${phone2}${phone3}`,
                          }));
                        }}
                        disabled={verifyCode.length !== 6}
                      >
                        다음
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {currentStep === 3 && (
        <Button
          className="w-11/12 mx-auto text-lg h-16 mb-10"
          onClick={handleGetVerification}
          disabled={currentStep < 3 || !isPhoneComplete || !selectedCarrier}
        >
          인증번호 요청
        </Button>
      )}
    </>
  );
}
