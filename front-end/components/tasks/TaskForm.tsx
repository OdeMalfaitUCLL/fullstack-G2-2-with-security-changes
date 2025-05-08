import React, { useState } from "react";
import TaskService from "../../services/TaskService";
import { Priority, StatusMessage } from "../../types";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

const TaskForm: React.FC = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [sidenote, setSidenote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>({
    levelName: "",
    colour: "",
  });
  const [userId, setUserId] = useState(1);
  const [deadlineError, setDeadlineError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const { t } = useTranslation();

  const clearErrors = () => {
    setDeadlineError("");
    setDescriptionError("");
    setPriorityError("");
    setStatusMessages([]);
  };
  const validate = (): boolean => {
    if (!description || description.trim() === "") {
      setDescriptionError("");
      return false;
    }
    const today = new Date().toISOString().split("T")[0];

    if (deadline < today) {
      setDeadlineError(t("addTask.validate.deadlineError2"));
      return false;
    }

    if (!deadline || deadline.trim() === "") {
      setDeadlineError(t("addTask.validate.deadlineError"));
      return false;
    }

    const now = new Date();
    console.log(now.toLocaleString("en-GB", { timeZone: "Europe/London" }));
    console.log(
      new Date(deadline).toLocaleString("en-GB", { timeZone: "Europe/London" })
    );
    if (
      new Date(deadline).toLocaleString("en-GB", {
        timeZone: "Europe/London",
      }) < now.toLocaleString("en-GB", { timeZone: "Europe/London" })
    ) {
      setDeadlineError(t("addTask.validate.deadlineError2"));
      return false;
    }

    if (
      priority.levelName !== "basic" &&
      priority.levelName !== "neutral" &&
      priority.levelName !== "urgent"
    ) {
      setPriorityError(t("addTask.validate.priorityError"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) {
      return;
    }

    const response = await TaskService.createTask({
      description,
      sidenote,
      deadline: new Date(deadline),
      priority,
      user: { id: userId },
    });
    setDescription(description);
    setSidenote(sidenote);
    setDeadline(deadline);
    setUserId(1);
    if (response && response.status === 200) {
      setTimeout(() => {
        router.push("/tasks");
      }, 2000);
    } else {
      setStatusMessages([
        {
          message: t("addTask.error"),
          type: "error",
        },
      ]);
    }
  };

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;

    setPriority({
      levelName: value,
      colour: getPriorityColor(value),
    });
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "urgent":
        return "red";
      case "neutral":
        return "yellow";
      case "basic":
        return "green";
      default:
        return "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 rounded-lg mx-auto shadow flex flex-col items-stretch"
    >
      <div className=" flex flex-col my-3">
        <label htmlFor="description"> {t("addTask.description")}: </label>
        <input
          className="border-2 border-gray-300 rounded"
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {descriptionError && (
          <small className="text-[#b62626]">{descriptionError}</small>
        )}
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="sidenote">{t("addTask.sidenote")}:</label>
        <textarea
          className="border-2 border-gray-300 rounded"
          id="sidenote"
          name="sidenote"
          value={sidenote}
          onChange={(e) => setSidenote(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="deadline">{t("addTask.deadline")}:</label>
        <input
          className=" border-2 border-gray-300 rounded"
          type="datetime-local"
          id="deadline"
          name="deadline"
          value={deadline.toString()}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        {deadlineError && (
          <small className="text-[#b62626]">{deadlineError}</small>
        )}
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="priorityLevel">{t("addTask.priorityLevel")}:</label>
        <select
          className=" border-2 border-gray-300 rounded"
          id="priorityLevel"
          name="levelName"
          value={priority.levelName}
          onChange={handlePriorityChange}
          required
        >
          <option value="">{t("addTask.priority.select")}</option>
          <option value="urgent">{t("addTask.priority.urgent")}</option>
          <option value="neutral">{t("addTask.priority.neutral")}</option>
          <option value="basic">{t("addTask.priority.basic")}</option>
        </select>
      </div>
      {priorityError && (
        <small className="text-[#b62626]">{priorityError}</small>
      )}
      <button
        className="p-2 rounded bg-[#474132] text-[#ffffff] mt-2"
        type="submit"
      >
        {t("addTask.button")}
      </button>
      {statusMessages && (
        <ul className="list-none">
          {statusMessages.map(({ message, type }, index) => (
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
      )}
    </form>
  );
};

export default TaskForm;
