import { lazy } from "react";
import {
  createBrowserRouter,
  ScrollRestoration,
  RouterProvider,
} from "react-router-dom";
// Error handling
import { AsyncBoundary } from "@toss/async-boundary";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";
import LoadingSpinner from "@/components/ui/LoadingByulbut";
// constants
import { PATH } from "./constants";
// contexts
import { SignUpFormProvider } from "@/contexts/SignUpContext";
// pages
import Layout from "./components/layout";
import HomePage from "./pages/HomePage";
import StocksPage from "./pages/StocksPage";
import PensionPage from "./pages/PensionPage";
import AIchatPage from "./pages/AIchatPage";
import InsurancePage from "./pages/InsurancePage";
import VirtualCurrencyPage from "./pages/VirtualCurrencyPage";
import MakePensionSavingPage from "./pages/MakePensionSavingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
// import SurveyPage from "./pages/SurveyPage";
// import SurveyResultPage from "./pages/SurveyResultPage";
// import PredictNationalPensionPage from "./pages/PredictNationalPensionPage";
// import ComparePensionPage from "./pages/ComparePensionPage";
// import MyData from "./pages/MyData";
// import PortfolioPage from "./pages/PortfolioPage";
// import ShopPage from "./pages/ShopPage";
// import AccountDetailPage from "./pages/AccountDetailPage";
// import SendMoneyPage from "./pages/SendMoneyPage";
// import SendMoneySelfPage from "./pages/SendMoneySelfPage";
// import ShopProductDetailPage from "./pages/ShopProductDetailPage";

const SurveyPage = lazy(() => import("./pages/SurveyPage"));
const SurveyResultPage = lazy(() => import("./pages/SurveyResultPage"));
const PredictNationalPensionPage = lazy(
  () => import("./pages/PredictNationalPensionPage")
);
const ComparePensionPage = lazy(() => import("./pages/ComparePensionPage"));
const MyData = lazy(() => import("./pages/MyData"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const AccountDetailPage = lazy(() => import("./pages/AccountDetailPage"));
const SendMoneyPage = lazy(() => import("./pages/SendMoneyPage"));
const SendMoneySelfPage = lazy(() => import("./pages/SendMoneySelfPage"));
const ShopProductDetailPage = lazy(
  () => import("./pages/ShopProductDetailPage")
);

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: (
      <AsyncBoundary
        pendingFallback={<LoadingSpinner />}
        rejectedFallback={(error) => <GlobalErrorFallback {...error} />}
      >
        <ScrollRestoration />
        <Layout />
      </AsyncBoundary>
    ),
    children: [
      {
        path: "*",
        element: <HomePage />,
      },
      {
        path: PATH.HOME,
        element: <HomePage />,
      },
      {
        path: PATH.STOCK,
        element: <StocksPage />,
      },
      { path: PATH.INSURANCE, element: <InsurancePage /> },
      {
        path: PATH.PENSION,
        element: <PensionPage />,
      },
      {
        path: PATH.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: PATH.SIGN_UP,
        element: (
          <SignUpFormProvider>
            <SignUpPage />
          </SignUpFormProvider>
        ),
      },
      {
        path: PATH.SURVEY,
        element: <SurveyPage />,
      },
      {
        path: PATH.SURVEY_RESULT,
        element: <SurveyResultPage />,
      },
      {
        path: PATH.PREDICT_NATIONAL_PENSION,
        element: <PredictNationalPensionPage />,
      },
      {
        path: PATH.COMPARE_PENSION,
        element: <ComparePensionPage />,
      },
      {
        path: PATH.AI_CHAT,
        element: <AIchatPage />,
      },
      {
        path: PATH.MY_DATA,
        element: <MyData />,
      },
      {
        path: PATH.VIRTUAL_CURRENCY,
        element: <VirtualCurrencyPage />,
      },
      {
        path: PATH.PORTFOLIO,
        element: <PortfolioPage />,
      },
      {
        path: PATH.SHOP,
        element: <ShopPage />,
      },
      {
        path: `${PATH.SHOP}/:productNum`,
        element: <ShopProductDetailPage />,
      },
      {
        path: `${PATH.ACCOUNT_DETAIL}/:accountNum`,
        element: <AccountDetailPage />,
      },
      {
        path: PATH.SEND_MONEY,
        element: <SendMoneyPage />,
      },
      {
        path: PATH.SEND_MONEY_SELF,
        element: <SendMoneySelfPage />,
      },
      {
        path: PATH.MAKE_PENSION_SAVING,
        element: <MakePensionSavingPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
