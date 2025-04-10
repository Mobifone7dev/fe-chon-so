import { FC, Suspense } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

const SuspensedView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  TopBarProgress.config({
    barColors: {
      "0": "#1a53ff",
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};
export { SuspensedView };
