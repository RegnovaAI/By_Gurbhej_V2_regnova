import Header from "@/components/Header";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const pagesWithHeader = ["/profile"];
  const showHeader = !pagesWithHeader.includes(router.pathname);
  return (
    <>
      {showHeader && <Header />}
      <Component {...pageProps} />
    </>
  );
}
