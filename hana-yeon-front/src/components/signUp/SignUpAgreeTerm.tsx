import { useEffect } from "react";
// contexts
import { useSignUpFormContext } from "@/contexts/SignUpContext";
// constants
import {
  OPEN_BANKING_INQUIRY_TERMS,
  IDENTITY_VERIFICATION_AGREEMENT_TERMS,
} from "@/constants";
// components
import Button from "@/components/ui/Button";

interface ISignUpAgreeTermProps {
  history: any;
}

export default function SignUpAgreeTerm({ history }: ISignUpAgreeTermProps) {
  const { register, watch, setValue } = useSignUpFormContext();
  const { agreeTerms1, agreeTerms2 } = watch();

  const handleAllAgreements = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setValue("agreeAll", checked);
    setValue("agreeTerms1", checked, { shouldValidate: true });
    setValue("agreeTerms2", checked, { shouldValidate: true });
  };

  useEffect(() => {
    const isAllChecked = agreeTerms1 && agreeTerms2;
    if (watch("agreeAll") !== isAllChecked) {
      setValue("agreeAll", isAllChecked);
    }
  }, [agreeTerms1, agreeTerms2, setValue, watch]);

  return (
    <div className="flex flex-col p-6 py-0">
      <div className="flex-grow overflow-y-auto relative mb-20">
        <div className="space-y-4 mt-8">
          <div className="flex items-center space-x-2 py-5">
            <input
              type="checkbox"
              id="terms-all"
              className="accent-olo"
              {...register("agreeAll")}
              onChange={handleAllAgreements}
            />
            <label htmlFor="terms-all" className="font-semibold">
              약관 전체 동의
            </label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {OPEN_BANKING_INQUIRY_TERMS.TITLE}
              </h3>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                >
                  동의
                </label>
                <input
                  type="checkbox"
                  id="terms1"
                  className="accent-olo"
                  checked={agreeTerms1}
                  {...register("agreeTerms1", { required: true })}
                />
              </div>
            </div>
            <div className="h-28 overflow-y-auto p-3 border border-gray-400 rounded-md text-xs">
              {OPEN_BANKING_INQUIRY_TERMS.TEXT.map((term) => (
                <div key={term.title} className="mb-2">
                  <p className="font-bold text-gray-500 dark:text-gray-300">
                    {term.title}
                  </p>
                  <p className="text-gray-400 dark:text-gray-300">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {IDENTITY_VERIFICATION_AGREEMENT_TERMS.TITLE}
              </h3>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="terms2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                >
                  동의
                </label>
                <input
                  type="checkbox"
                  id="terms2"
                  className="accent-olo"
                  checked={agreeTerms2}
                  {...register("agreeTerms2", { required: true })}
                />
              </div>
            </div>
            <div className="h-28 overflow-y-auto p-3 border border-gray-400 rounded-md text-xs">
              {IDENTITY_VERIFICATION_AGREEMENT_TERMS.TEXT.map((term) => (
                <div key={term.title} className="mb-2">
                  <p className="font-bold text-gray-500 dark:text-gray-300">
                    {term.title}
                  </p>
                  <p className="text-gray-400 dark:text-gray-300">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="text-lg h-16 mb-10"
        onClick={() => {
          history.push("CombinedInput", {
            agreedTerms: [agreeTerms1, agreeTerms2],
          });
        }}
        disabled={!(agreeTerms1 && agreeTerms2)}
      >
        다음
      </Button>
    </div>
  );
}
