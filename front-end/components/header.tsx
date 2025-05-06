import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User } from "../types";
import Image from "next/image";
import Language from "./language/Language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const [loggedInUser, setloggedInUser] = useState<User | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    setloggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  return (
    <>
      <header className=" bg-[#e2dbd3] flex flex-wrap flex-row items-center justify-between m-3 p-2 rounded-2xl">
        <Image
          src="/images/donedeal_logo_transparant.png"
          alt="logo donedeal"
          width={150}
          height={150}
        />
        <nav className="flex flex-wrap flex-row m-2 rounded-md justify-between items-stretch px-2">
          <Language></Language>
          <Link
            href="/"
            className="nav-link p-2 fs-6 m-1 rounded-md hover:bg-[#d8cfc4] "
          >
            {t("header.nav.home")}
          </Link>

          {!loggedInUser && (
            <Link
              href="/login"
              className="nav-link p-2 m-1 fs-6 text-white bg-[#474132] hover:bg-[#655d53] rounded-md"
            >
              {t("header.nav.login")}
            </Link>
          )}
          {loggedInUser?.role === "admin" && (
            <>
              <Link
                href="/users"
                className="nav-link p-2 fs-6 text-dark m-1 rounded-md hover:bg-[#d8cfc4] "
              >
                {t("header.nav.users")}
              </Link>
            </>
          )}

          {loggedInUser && (
            <>
              <Link
                href="/tasks"
                className="nav-link p-2 fs-6 text-dark  m-1 rounded-md hover:bg-[#d8cfc4]"
              >
                {t("header.nav.tasks")}
              </Link>
              <Link
                href="/profile"
                className="nav-link p-2 fs-6 text-dark  m-1 rounded-md hover:bg-[#d8cfc4]"
              >
                {t("header.nav.profile")}
              </Link>
              <div className="nav-link p-2  fs-6 mt-1 ml-6 text-[#534e46] italic">
                {t("header.welcome")}, {loggedInUser.role}{" "}
                {loggedInUser.username}!
              </div>
              <Link
                href="/login"
                className="nav-link p-2 m-1 fs-6 text-white bg-[#474132] hover:bg-[#655d53] rounded-md "
                onClick={() => {
                  sessionStorage.removeItem("loggedInUser");
                  localStorage.removeItem("loggedInUser");
                  setloggedInUser(null);
                }}
              >
                {" "}
                {t("header.nav.logout")}
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
