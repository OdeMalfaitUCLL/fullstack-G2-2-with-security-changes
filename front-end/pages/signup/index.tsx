import Head from "next/head";
import UserSignupForm from "../../components/users/UserSignupForm";
import Header from "../../components/header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Signup: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("signup.title")} </title>
      </Head>
      <Header />
      <section className="p-6 min-h-screen flex flex-col items-center">
        <UserSignupForm />
      </section>
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

export default Signup;
