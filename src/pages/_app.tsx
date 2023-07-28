import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ModalProvider } from "providers/modal-provider";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState<boolean>();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return;

  return (
    <>
      <Component {...pageProps} />;
      <ModalProvider />
      <Toaster position="top-center" />
    </>
  );
};

export default api.withTRPC(MyApp);
