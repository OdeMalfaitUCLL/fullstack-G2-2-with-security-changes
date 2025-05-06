import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Header from "../components/header";
import UserTableHome from "../components/users/UserTableHome";
import UserService from "../services/UserService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Welcome from "../components/Welcome";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const data = [
    { username: "admin", password: "admin123", role: "Admin" },
    {
      username: "ode_m",
      password: "ode123",
      role: "User",
    },
    {
      username: "lotte_g",
      password: "lotte123",
      role: "User",
    },
    {
      username: "guest",
      password: "guest132",
      role: "Guest",
    },
  ];
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
