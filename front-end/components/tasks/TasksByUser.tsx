import { Task, User } from "../../types";
import { table } from "console";
import React from "react";

type Props = {
  user: User;
};

const TasksByUser: React.FC<Props> = ({ user }) => {
  return (
    <>
      {user &&
        user.tasks &&
        user.tasks.map((task, index) => (
          <table
            className={`border border-${task.priority.colour} border-opacity-50 border-4 m-2 bg-secondary bg-opacity-25`}
          >
            <tr key={index}>
              <td>Description: </td>
              <td>{task.description}</td>
            </tr>
            <tr>
              <td>Sidenote:</td>
              <td>{task.sidenote}</td>
            </tr>
          </table>
        ))}
      {!user.tasks && <p>No Active Tasks for this user</p>}
    </>
  );
};

export default TasksByUser;
