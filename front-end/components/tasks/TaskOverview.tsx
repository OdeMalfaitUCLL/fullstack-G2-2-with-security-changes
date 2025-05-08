import { StatusMessage, Task } from "../../types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TaskService from "../../services/TaskService";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
type Props = {
  tasks: Array<Task>;
};

const TaskOverview: React.FC<Props> = ({ tasks }) => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<StatusMessage[]>([]);
  const { t } = useTranslation();
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const finishTask = (task: Task) => {
    //fetch request to update task.done to true:
    TaskService.finishTask({ taskId: task.id, userId: task.user.id });
    //!! watch out for the userId, it should be dynamic: you can only finish the task of user 1 (johnDoe) atm
  };
  const deleteTask = async (task: Task) => {
    setStatusMessage([]);
    try {
      const response = await TaskService.deleteTask({ taskId: task.id });
      if (response.status === 200) {
        setStatusMessage([
          { message: t("tasks.messages.delete"), type: "success" },
        ]);
        return response;
      }
    } catch (error) {
      console.log(error);
      setStatusMessage([{ message: error, type: "error" }]);
    }
  };
  const openAreYouSure = (task: Task) => {
    setSelectedTask(task);
    setAreYouSure(true);
  };
  // if (!tasks || tasks.length === 0) {
  //   return <p>No Active Tasks</p>;
  // }
  //dit stuk verplaats naar beneden, gaf errors met mijn timer

  const determineColour = (task: Task) => {
    if (task.priority.colour === "green") {
      return "#4daa2b";
    } else if (task.priority.colour === "yellow") {
      return "#e19e4c";
    } else if (task.priority.colour === "red") {
      return "#d34e4e";
    } else {
      return "#ffffff";
    }
  };
  useEffect(() => {
    if (statusMessage.length > 0) {
      const timer = setTimeout(() => {
        setStatusMessage([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  return (
    <div className="flex flex-column">
      {statusMessage && (
        <div className="text-center">
          <ul className="list-none">
            {statusMessage.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-[#b62626]": type == "error",
                  "text-[#26b639]": type == "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!tasks || tasks.length === 0 ? (
        <p className="m-5">{t("tasks.none")} </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:grid-cols-4">
          {/* popup for are you sure before deleting task */}
          {areYouSure && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
                <h3 className="font-semibold">Are you sure?</h3>
                <p>Do you really want to delete this task?</p>
                <div className="flex flex-row p-2 m-2 justify-evenly">
                  <button
                    className="rounded bg-[#b1a27b] hover:bg-[#9d8e68] text-[#000000] mt-2"
                    onClick={() => {
                      setAreYouSure(false);
                      deleteTask(selectedTask);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-[#b1a27b] hover:bg-[#9d8e68] text-[#000000] mt-2"
                    onClick={() => {
                      setAreYouSure(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {Array.isArray(tasks) &&
            tasks.map((task, index) => (
              <li
                key={index}
                className={` m-2 bg-[#dfceba] bg-opacity-25 container rounded shadow border`}
              >
                <div className="flex items-center mb-3">
                  <span
                    style={{ backgroundColor: determineColour(task) }}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold leading-5 text-white font-display mr-2 capitalize"
                  >
                    {t(`tasks.priority.${task.priority.levelName}`)}
                  </span>
                  <p className="font-mono text-xs font-normal opacity-75 pt-2 text-black">
                    {new Date(task.startDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-display max-w-sm text-2xl font-bold leading-tight">
                  <span className=" text-black">{task.description}</span>
                </p>
                <p className="font-display max-w-sm text-md  leading-tight">
                  <span className=" text-black">{task.sidenote}</span>
                </p>
                <div className="flex justify-between ">
                  <p className="font-mono text-xs font-normal opacity-75 pt-2 text-black underline">
                    {" "}
                    {t("tasks.deadline").toLocaleUpperCase()}:{" "}
                    {new Date(task.deadline).toLocaleDateString()}{" "}
                  </p>
                  {!task.done && (
                    <Image
                      className="cursor-pointer rounded bg-[#b1a27b] hover:bg-[#9d8e68] m-2 p-2"
                      src="/images/check-mark.png"
                      alt="Check Mark icon"
                      width={40}
                      height={40}
                      onClick={() => {
                        finishTask(task);
                      }}
                    />
                  )}
                  {!task.done && (
                    <Image
                      className="cursor-pointer rounded bg-[#b1a27b] hover:bg-[#9d8e68] m-2 p-2"
                      src="/images/edit.png"
                      alt="Check Mark icon"
                      width={40}
                      height={40}
                      onClick={() => {
                        router.push(`/tasks/${task.id}`);
                      }}
                    />
                  )}
                  {task && (
                    <Image
                      className="cursor-pointer rounded bg-[#b1a27b] hover:bg-[#9d8e68] m-2 p-2"
                      src="/images/bin.png"
                      alt="Check Mark icon"
                      width={40}
                      height={40}
                      onClick={() => {
                        openAreYouSure(task);
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TaskOverview;
