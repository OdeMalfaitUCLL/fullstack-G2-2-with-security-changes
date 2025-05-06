import { useState } from "react";
import { StatusMessage } from "../../types";
import classNames from "classnames";
import UserService from "../../services/UserService";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const UserSignupForm: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage[]>([]);
  const { t } = useTranslation();
  const clearErrors = () => {
    setNameError("");
    setPasswordError("");
    setStatusMessage([]);
  };
  const userExists = async (username): Promise<boolean> => {
    const response = await UserService.userExists(username);
    return response;
  };
  const validate = async (): Promise<boolean> => {
    let result = true;
    if (!username && username.trim() === "") {
      setNameError(t("signup.validate.usernameError"));
      result = false;
    } else {
      const userDoesExists = await userExists(username);
      if (userDoesExists) {
        setNameError(`${t("signup.validate.usernameError2")}: ${username}.`);
        result = false;
      }
    }
    if (!password && password.trim() === "") {
      setPasswordError(t("signup.validate.passwordError"));
      result = false;
    }
    return result;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const isValid = await validate();
    if (!isValid) {
      return;
    }
    const response = await UserService.signupUser({
      username,
      password,
      role: "user",
    });
    if (response && response.status === 200) {
      setStatusMessage([
        {
          message: t("signup.success"),
          type: "success",
        },
      ]);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else if (response && response.status === 400) {
      const { errorMessage } = await response.json();
      setStatusMessage([{ message: errorMessage, type: "error" }]);
    } else {
      setStatusMessage([
        {
          message: t("signup.error"),
          type: "error",
        },
      ]);
    }
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <h3 className="p-2">{t("signup.page.title")} </h3>
      {statusMessage && (
        <div>
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
      <form
        onSubmit={(event) => {
          handleSubmit(event);
        }}
        className=" border flex flex-center flex-col p-3 rounded shadow "
      >
        <div className="flex-row my-3">
          <label htmlFor="nameInput">{t("signup.validate.username")}:</label>

          <input
            className="mx-2 border-2 border-gray-300 rounded"
            id="nameInput"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          {nameError && (
            <div className="text-[#b62626] text-center"> {nameError} </div>
          )}
        </div>
        <div className="flex-row my-3">
          <label htmlFor="nameInput">{t("signup.validate.password")}:</label>

          <input
            className="mx-2 border-2 border-gray-300 rounded"
            id="passwordInput"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {passwordError && (
            <div className="text-[#b62626] text-center"> {nameError} </div>
          )}
        </div>
        <button
          type="submit"
          className="m-2 p-2 rounded bg-[#474132] text-[#ffffff]"
        >
          {t("signup.button")}
        </button>
      </form>
    </>
  );
};
export default UserSignupForm;
