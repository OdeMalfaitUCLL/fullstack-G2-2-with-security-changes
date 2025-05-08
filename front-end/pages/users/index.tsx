import Head from "next/head";
import React, { useEffect, useState } from "react";
import { User } from "../../types";
import Header from "../../components/header";
import UserService from "../../services/UserService";
import UserOverview from "../../components/users/UserOverview";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Users: React.FC = () => {
  const [error, seterror] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User>(null);
  const { t } = useTranslation();
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);
  const getUsers = async () => {
    seterror(null);
    const response = await UserService.getUsers();
    if (response.ok) {
      const users = await response.json();
      return { users };
    } else {
      seterror(t("auth.error"));
      return { users: [] };
    }
  };
  const { data, isLoading } = useSWR("users", getUsers);
  useInterval(() => {
    if (!error) mutate("users", getUsers());
  }, 5000);

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Header />
      <main className="d-flex  flex-column ">
        <h1 className="align-self-center">
          {" "}
          {loggedInUser &&
            `${
              loggedInUser.role === "admin"
                ? "All Users (admin)"
                : `User: ${loggedInUser.username}`
            }`}
        </h1>
        <section className="align-self-center d-flex flex-row p-2 ">
          {error && <p className="text-[#b62626]">{error}</p>}
          {!error && isLoading && <p className="text-[#2866da]">Loading....</p>}
          {!error && data && <UserOverview users={data.users}></UserOverview>}
        </section>
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

export default Users;
