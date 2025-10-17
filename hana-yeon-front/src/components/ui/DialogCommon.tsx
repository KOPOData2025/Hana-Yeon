import { useEffect, type PropsWithChildren } from "react";
import { GlobalPortal } from "tosslib";
import Button from "./Button";

interface DialogProps {
  open: boolean;
  title?: string;
  type: "alert" | "confirm";
  btn1Text?: string;
  btn2Text?: string;
  btn1Handler?: (param?: any) => void;
  btn2Handler?: (param?: any) => void;
}

export default function DialogCommon(props: PropsWithChildren<DialogProps>) {
  const {
    open,
    title,
    type,
    btn1Text,
    btn2Text,
    btn1Handler,
    btn2Handler,
    children,
  } = props;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    open && (
      <GlobalPortal.Consumer>
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40 text-gray-700 z-[9999]">
          <div className="flex flex-col justify-between rounded-lg p-5 w-[300px] h-fit bg-gray-50 shadow-xl border border-gray-300 dark:border-gray-300">
            <div className="flex flex-col py-3 h-full whitespace-nowrap">
              {title && (
                <span className="text-gray-700 font-bold text-2xl mb-4">
                  {title}
                </span>
              )}
              {children}
            </div>
            {type === "alert" ? (
              <div className="flex justify-end font-medium text-primary">
                <div className="cursor-pointer" onClick={btn1Handler}>
                  {btn1Text}
                </div>
              </div>
            ) : (
              <div className="flex justify-around">
                <Button
                  onClick={btn1Handler}
                  className="w-[120px] h-[50px] bg-gray-400 text-gray-600"
                >
                  {btn1Text}
                </Button>
                <Button
                  onClick={btn2Handler}
                  className="w-[120px] h-[50px] bg-primary text-white"
                >
                  {btn2Text}
                </Button>
              </div>
            )}
          </div>
        </div>
      </GlobalPortal.Consumer>
    )
  );
}
