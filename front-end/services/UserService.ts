import { User } from "../types";

const getUsers = async () => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: ` Bearer ${token}`,
    },
  });
};
const userExists = async (username: string): Promise<boolean> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/users/exists/${username}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("failed to look for existing user");
  }
  const result = await response.json();
  return result;
};

const loginUser = async (user: User) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? "Failed To login user");
    }
    return response;
  } catch (error) {
    console.log(error);
    return { status: 401, message: error.message };
  }
};
const signupUser = async (user: {
  username: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/signup",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to sign up user");
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};
const deleteUser = async (userId: number) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/users/deleteUser/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const updatePassword = async (oldPassword, newPassword) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/changePassword",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? "Failed To Update Password");
    }
    return response.json();
  } catch (error) {
    console.log(error);
    return { status: 401, message: error.message };
  }
};

const UserService = {
  getUsers,
  loginUser,
  signupUser,
  userExists,
  deleteUser,
  updatePassword,
};

export default UserService;
