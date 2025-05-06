import { useRouter } from "next/router";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import TaskService from "../../services/TaskService";
import { Task } from "../../types";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const EditTaskById: React.FC = () => {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const { t } = useTranslation();
  const { id } = router.query;
  const getTaskById = async () => {
    try {
      const foundTask = await TaskService.getTaskById({
        taskId: Number(id as string),
      });
      console.log("Fetched task:", foundTask);
      setTask(foundTask);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };
  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    if (id) {
      getTaskById();
    }
  }, [id]);
  return (
    <>
      <Head>
        <title>Edit Task</title>
      </Head>
      <Header />
      <main>
        <h1 className="align-self-start font-['Open_Sans'] text-4xl font-bold text-[#534e46] text-center">
          Edit Task
        </h1>
        {task && (
          <div className="mt-4">
            <EditTaskForm task={task} />
          </div>
        )}
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
export default EditTaskById;
