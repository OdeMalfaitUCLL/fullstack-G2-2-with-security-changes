import { useState } from "react";
import { StatusMessage } from "../../types";
import classNames from "classnames";
import UserService from "../../services/UserService";
import { useRouter } from "next/router";

const ChangePasswordForm: React.FC = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage[]>([]);
  const clearErrors = () => {
    setPasswordError("");
    setStatusMessage([]);
  };
  const validate = (): boolean => {
    let result = true;
    if (!oldPassword || oldPassword.trim() === "") {
      setPasswordError("Current Password is required");
      result = false;
    } else if (!newPassword || newPassword.trim() === "") {
      setPasswordError("New Password is required");
      result = false;
    }
    return result;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();
    if (!validate()) {
      return;
    }
    const response = await UserService.updatePassword(oldPassword, newPassword);
    if (response && response.status === 200) {
      setStatusMessage([
        {
          message: response.message,
          type: "success",
        },
      ]);
      setTimeout(() => {
        setStatusMessage([]);
        sessionStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInUser");
        router.push("/login");
      }, 2000);
    } else {
      setStatusMessage([
        {
          message: response.message,
          type: "error",
        },
      ]);
    }
  };

  return (
    <>
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
        onSubmit={(event) => handleSubmit(event)}
        className=" border flex flex-center flex-col p-3 rounded shadow "
      >
        <div className="flex-row my-3">
          <label htmlFor="nameInput">Current Password:</label>
          <input
            className="mx-2 border-2 border-gray-300 rounded"
            id="nameInput"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
          />
          {passwordError && (
            <div className="text-[#b62626] text-center"> {passwordError} </div>
          )}
        </div>
        <div className="flex-row my-3">
          <label htmlFor="nameInput">New Password:</label>

          <input
            className="mx-2 border-2 border-gray-300 rounded"
            id="passwordInput"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          {passwordError && (
            <div className="text-[#b62626] text-center"> {passwordError} </div>
          )}
        </div>

        <button
          type="submit"
          className="m-2 p-2 rounded bg-[#474132] text-[#ffffff]"
        >
          Change Password
        </button>
      </form>
    </>
  );
};
export default ChangePasswordForm;
