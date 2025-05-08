import Head from "next/head";
import React from "react";
import Header from "../components/header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Welcome from "../components/Welcome";

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("app.title")} </title>
      </Head>

      <main className="">
        <Header />
        <Welcome></Welcome>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Home;
