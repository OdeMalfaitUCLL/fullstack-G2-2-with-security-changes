import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="border-2 border-[#534e46] p-2 m-1 fs-6 rounded">
      <label htmlFor="language" className="text-[#534e46] font-mono">
        Language
      </label>
      <select
        id="language"
        className="ml-2 p-1 text-sm rounded-lg"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};
export default Language;
