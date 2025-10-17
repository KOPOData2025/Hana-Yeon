import { motion, AnimatePresence } from "motion/react";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
// constants
import { BANK_IMAGE_MAP, PATH } from "@/constants";
// libs
import { formatBalance } from "@/lib";
// types
import type { GetAllAccountsResponse } from "@/types";

export default function FillAccountDrawer({
  isOpen,
  onClose,
  allAccountData,
  opponentAccount,
  opponentBankCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  allAccountData: GetAllAccountsResponse;
  opponentAccount: string;
  opponentBankCode: string;
}) {
  const router = useInternalRouter();

  const handleSelectAccount = (selectedAccount: {
    accountNum: string;
    bankCodeStd: string;
  }) => {
    router.push(PATH.SEND_MONEY_SELF, {
      state: {
        selfBankCode: selectedAccount.bankCodeStd,
        selfAccount: selectedAccount.accountNum,
        opponentAccount,
        opponentBankCode,
      },
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white dark:bg-gray-800 rounded-t-xl z-50 shadow-lg max-h-[70vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto mb-6" />

              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                어떤 계좌에서 돈을 가져올까요?
              </h2>

              <div className="max-h-[calc(70vh-140px)] overflow-y-auto">
                {allAccountData.map((account) => {
                  return (
                    <div
                      key={account.accountNum}
                      className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
                      onClick={() =>
                        handleSelectAccount({
                          accountNum: account.accountNum,
                          bankCodeStd: account.bankCodeStd,
                        })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={BANK_IMAGE_MAP.get(account.bankCodeStd)}
                            alt={account.bankName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white w-36 truncate">
                              {account.productName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {account.accountNum}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatBalance(Number(account.balanceAmt))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
