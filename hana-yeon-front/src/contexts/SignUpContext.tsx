import { type PropsWithChildren } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";
import type { TSignUpFormValues } from "@/types";

export const useSignUpFormContext = (): UseFormReturn<TSignUpFormValues> =>
  useFormContext<TSignUpFormValues>();

export const SignUpFormProvider = ({ children }: PropsWithChildren) => {
  const form = useForm<TSignUpFormValues>({
    mode: "onChange",
    defaultValues: {
      agreeAll: false,
      agreeTerms1: false,
      agreeTerms2: false,
      userName: "",
      ssn1: "",
      ssn2: "",
      userCi: "",
      phone1: "010",
      phone2: "",
      phone3: "",
      verifyCode: "",
      simplePin: "",
      simplePinConfirm: "",
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};
