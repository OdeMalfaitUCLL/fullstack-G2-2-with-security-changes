import { useState } from "react";
import { Task } from "../../types";
import Head from "next/head";
import Header from "../../components/header";
import TaskForm from "../../components/tasks/TaskForm";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const addTask: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("addTask.title")} </title>
      </Head>
      <Header />
      <main className="d-flex  flex-column ">
        <h1 className="align-self-center">{t("addTask.title")}</h1>
        <section className="align-self-center w-full max-w-md p-8 rounded-lg mx-auto">
          <TaskForm></TaskForm>
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

export default addTask;
