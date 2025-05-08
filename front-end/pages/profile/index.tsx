import { useEffect, useState } from "react";
import { User } from "../../types";
import Head from "next/head";
import Header from "../../components/header";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ChangePasswordForm from "../../components/users/ChangePasswordForm";

const Profile: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User>(null);
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header />
      <main className="d-flex  flex-column ">
        {!loggedInUser && <h1 className="align-self-center"> Anonymous</h1>}
        {loggedInUser && (
          <h1 className="align-self-center">
            {loggedInUser.username}'s Profile
          </h1>
        )}
        {!loggedInUser && (
          <p className="text-red-700">
            To see your profile, you must be logged in!
          </p>
        )}
        {loggedInUser && (
          <section className="align-self-center my-4">
            <p>Username: {loggedInUser.username}</p>
            <p>Role: {loggedInUser.role}</p>
          </section>
        )}
        {loggedInUser && (
          <section className="align-self-center">
            <ChangePasswordForm />
          </section>
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
export default Profile;
