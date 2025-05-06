import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Task, User } from "../../types";
import TaskService from "../../services/TaskService";
import Header from "../../components/header";
import TaskOverview from "../../components/tasks/TaskOverview";
import UserService from "../../services/UserService";
import UserOverview from "../../components/users/UserOverview";
import TasksByUser from "../../components/tasks/TasksByUser";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import UserTableHome from "../../components/users/UserTableHome";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Users: React.FC = () => {
  // const [selectedUser, setSelectedUser] = useState<User>();
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
        {/* {!error && (
          <p className="align-self-center">
            Click on the user to see their tasks.
          </p>
        )} */}
        <section className="align-self-center d-flex flex-row p-2 ">
          {error && <p className="text-[#b62626]">{error}</p>}
          {!error && isLoading && <p className="text-[#2866da]">Loading....</p>}
          {!error && data && (
            <UserOverview
              users={data.users}
              // selectUser={setSelectedUser}
            ></UserOverview>
          )}
        </section>
        {/* {!error && selectedUser && (
         <section className='align-self-center d-flex flex-column p-2 '>
         <h2> Tasks from "{selectedUser.username}"</h2>
         <TasksByUser user={selectedUser}></TasksByUser>
       </section> */}
        {/* )} */}
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
