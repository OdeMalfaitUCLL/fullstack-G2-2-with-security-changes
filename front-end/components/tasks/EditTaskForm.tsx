import { useEffect, useState } from "react";
import { Priority, Task } from "../../types";
import { useRouter } from "next/router";
import TaskService from "../../services/TaskService";
import { useTranslation } from "next-i18next";

type Props = {
  task: Task;
};
const EditTaskForm: React.FC<Props> = ({ task }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Task>(task);
  const [description, setDescription] = useState(formData.description);
  const [sidenote, setSidenote] = useState(formData.sidenote);
  const [deadline, setDeadline] = useState(formData.deadline.toString());
  const [deadlineError, setDeadlineError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [priority, setPriority] = useState<Priority>({
    levelName: formData.priority.levelName,
    colour: formData.priority.colour,
  });
  const { t } = useTranslation();
  useEffect(() => {
    if (task) {
      setFormData(task);
      setDescription(task.description);
      setSidenote(task.sidenote);
      setDeadline(task.deadline.toString());
      setPriority(task.priority);
    }
  }, [task]);
  const validate = (): boolean => {
    if (!description || description.trim() === "") {
      setDescriptionError(t("editTask.validate.descriptionError"));
      return false;
    }
    const today = new Date().toISOString().split("T")[0];

    if (deadline < today) {
      setDeadlineError(t("editTask.validate.deadlineError2"));
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
      setDeadlineError(t("editTask.validate.deadlineError3"));
      return false;
    }

    if (
      priority.levelName !== "basic" &&
      priority.levelName !== "neutral" &&
      priority.levelName !== "urgent"
    ) {
      setPriorityError(t("editTask.validate.priorityError"));
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeadlineError("");
    if (!validate()) {
      return;
    }

    const response = await TaskService.editTask({
      taskId: task.id,
      description,
      sidenote,
      deadline: new Date(deadline),
      priority,
    });
    setDescription(description);
    setSidenote(sidenote);
    setDeadline(deadline);
    if (response && response.status === 200) {
      setTimeout(() => {
        router.push("/tasks");
      }, 1000);
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
    <form className="w-full max-w-md p-8 pt-1 rounded-lg mx-auto shadow flex flex-col items-stretch">
      <button
        className="p-1 m-0"
        onClick={(e) => {
          e.preventDefault();
          router.push("/tasks");
        }}
      >
        <img
          className="size-8"
          src="/images/exit-cross.png"
          alt="close window cross button"
        />
      </button>
      <div className=" flex flex-col my-3">
        <h4 className="text-center">{t("editTask.title")} </h4>
        <h4 className="text-center">"{task.description}"</h4>
        <label htmlFor="description">{t("editTask.description")} </label>
        <input
          className="border-2 border-gray-300 rounded"
          type="text"
          id="description"
          name="description"
          defaultValue={formData.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {descriptionError && (
          <small className="text-[#b62626]">{descriptionError}</small>
        )}
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="sidenote"> {t("editTask.sidenote")} </label>
        <textarea
          className="border-2 border-gray-300 rounded"
          id="sidenote"
          name="sidenote"
          defaultValue={formData.sidenote}
          value={sidenote}
          onChange={(e) => setSidenote(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="deadline">{t("editTask.deadline")} :</label>
        <input
          className=" border-2 border-gray-300 rounded"
          type="datetime-local"
          id="deadline"
          name="deadline"
          defaultValue={deadline.toString()}
          value={deadline.toString()}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {deadlineError && (
          <small className="text-[#b62626]">{deadlineError}</small>
        )}
      </div>
      <div className="flex flex-col my-3">
        <label htmlFor="priorityLevel">{t("editTask.priorityLevel")} </label>
        <select
          className=" border-2 border-gray-300 rounded"
          id="priorityLevel"
          name="levelName"
          defaultValue={formData.priority.levelName}
          value={priority.levelName}
          onChange={handlePriorityChange}
        >
          <option value="">{t("editTask.priority.select")} </option>
          <option value="urgent">{t("editTask.priority.urgent")}</option>
          <option value="neutral">{t("editTask.priority.neutral")}</option>
          <option value="basic">{t("editTask.priority.basic")}</option>
        </select>
      </div>
      {priorityError && (
        <small className="text-[#b62626]">{priorityError}</small>
      )}
      <button
        className="p-2 rounded bg-[#474132] text-[#ffffff] mt-2"
        type="button"
        onClick={handleSubmit}
      >
        {t("editTask.button")}{" "}
      </button>
    </form>
  );
};

export default EditTaskForm;
