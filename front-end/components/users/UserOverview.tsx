import { useTranslation } from "next-i18next";
import UserService from "../../services/UserService";
import { User } from "../../types";
import React, { useEffect, useState } from "react";

type Props = {
  users: Array<User>;
  // selectUser: (user: User) => void;
};

const UserOverview: React.FC<Props> = ({ users }) => {
  const { t } = useTranslation();
  const [error, seterror] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User>(null);
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  const deleteUser = async (userId: number) => {
    const response = await UserService.deleteUser(userId);
    if (response.ok) {
      const users = await response.json();
      return;
    } else {
      seterror(t("auth.error"));
      return { users: [] };
    }
  };
  return (
    <>
      {error && <p className="text-[#b62626]">{error}</p>}
      <table>
        <thead>
          <tr className=" bg-[#af9a81] flex flex-row items-center m-2 p-1 rounded-2xl text-white font-bold text-xl">
            <th className="w-56 m-2 px-5 p-3 font-medium uppercase">Id</th>
            <th className="w-56 m-2 px-5 p-3 font-medium uppercase">
              Username
            </th>
            <th className="w-56 m-2 px-5 p-3 font-medium uppercase">Role</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user, index) => {
              return (
                <tr
                  key={index}
                  className="flex flex-row items-center border-b-2 border-[#d6ccaf] font-semibold text-xl"
                >
                  <td className="w-56 m-2  px-5 p-3">{user.id}</td>
                  <td className="w-56 m-2  px-5 p-3">{user.username}</td>
                  <td className="w-56 m-2  px-5 p-3">{user.role}</td>
                  {loggedInUser && loggedInUser.role === "admin" && (
                    <td>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-[#af9a81]"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {!users && <p>No Active Users</p>}
    </>
  );
};

export default UserOverview;
