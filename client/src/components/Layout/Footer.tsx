import type { JSX } from "react";

const Footer = (): JSX.Element => {
  return (
    <>
      <footer className="bg-slate-600 rounded-lg shadow-sm m-4">
        <div className="w-full mx-auto container p-4 md:flex md:items-center md:justify-between">
          <span className="text-lg text-white sm:text-center  font-medium">
            © 2025 Jonas4236.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-lg font-medium text-white sm:mt-0">
            <li>20251109</li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
