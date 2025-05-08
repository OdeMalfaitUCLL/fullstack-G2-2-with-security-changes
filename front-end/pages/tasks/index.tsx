import Head from "next/head";
import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import Header from "../../components/header";
import TaskOverview from "../../components/tasks/TaskOverview";
import Link from "next/link";
import useInterval from "use-interval";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { User } from "../../types";

const Tasks: React.FC = () => {
  const [priority, setPriority] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User>(null);
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);
  const getTasks = async () => {
    setError(null);
    if (priority === "all") {
      const response = await TaskService.getAllTasks();
      if (response.ok) {
        const tasks = await response.json();
        return { tasks };
      } else if (response.status === 401) {
        setError(t("auth.error"));
        return { tasks: [] };
      } else {
        setError(t("tasks.messages.error"));
        return { tasks: [] };
      }
    } else {
      const response = await TaskService.getTasksByPriority(priority);
      if (response.ok) {
        const tasks = await response.json();
        return { tasks };
      }
    }
  };
  const { data, isLoading } = useSWR("tasks", getTasks);

  useInterval(() => {
    if (!error) mutate("tasks", getTasks());
  }, 2000);
  return (
    <>
      <Head>
        <title> {t("tasks.title")} </title>
      </Head>
      <Header />
      <main className="d-flex  flex-column ">
        <h1 className="align-self-start font-['Open_Sans'] text-4xl font-bold text-[#534e46] ">
          {t("tasks.for")}{" "}
          {loggedInUser &&
            ` ${
              loggedInUser.role === "admin"
                ? "All Tasks (admin)"
                : loggedInUser.username
            }`}
        </h1>
        <section className="flex flex-row justify-start">
          <div>
            <section className="flex flex-column self-start m-3 border p-2 rounded bg-[#e2dbd3]">
              <button
                className="  m-1 p-2 rounded-lg hover:bg-[#655d53] duration-150 text-[#000000] hover:text-[#ffffff]"
                onClick={() => {
                  setPriority("all");
                }}
              >
                {t("tasks.all")}{" "}
              </button>
              <button
                className="  m-1 p-2 rounded-lg hover:bg-[#d34e4e] duration-150 text-[#000000] hover:text-[#ffffff]"
                onClick={() => {
                  setPriority("urgent");
                }}
              >
                {t("tasks.priority.urgent")}{" "}
              </button>
              <button
                className="  m-1 p-2 rounded-lg hover:bg-[#e19e4c] duration-150 text-[#000000] hover:text-[#ffffff]"
                onClick={() => {
                  setPriority("neutral");
                }}
              >
                {t("tasks.priority.neutral")}{" "}
              </button>
              <button
                className=" m-1 p-2 rounded-lg hover:bg-[#4daa2b] duration-150 text-[#000000] hover:text-[#ffffff]"
                onClick={() => {
                  setPriority("basic");
                }}
              >
                {t("tasks.priority.basic")}{" "}
              </button>
            </section>
            <section className="flex flex-col items-stretch bg-[#e2dbd3] m-3 border rounded p-2">
              {!error && (
                <button
                  className="hover:bg-[#655d53] text-[#000000] hover:text-[#ffffff] p-2 rounded"
                  onClick={() => router.push("/taskhistory")}
                >
                  {t("tasks.history")}{" "}
                </button>
              )}
            </section>
            {!error && (
              <Link href="/tasks/addTask">
                <button className="bg-[#474132] hover:bg-[#655d53] text-white font-bold mx-3 px-4 rounded">
                  + {t("tasks.add")}{" "}
                </button>
              </Link>
            )}
          </div>
          <section className="align-self-center d-flex flex-row p-2  self-center">
            {error && <p className="text-[#b62626]">{error}</p>}
            {!error && isLoading && (
              <p className="text-[#2866da]"> {t("loading")} </p>
            )}
            {!error && data && <TaskOverview tasks={data.tasks} />}
          </section>
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

export default Tasks;
