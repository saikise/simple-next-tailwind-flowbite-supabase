import Link from "next/link";

export default function Logo() {
  return (
    <span className="self-center font-semibold whitespace-nowrap dark:text-white">
      <span className="hover:text-gray-400 transition-colors duration-200">
        <Link href="/">Next.js Supabase Template</Link>
      </span>{" "}
      <sub>
        <span className="hover:text-gray-400 transition-colors duration-200">
          <Link href="https://medium.com/@saikise/create-a-project-template-following-a-single-article-next-js-13-app-router-supabase-full-stack-d78f4a43d157">Check tutorial here</Link>
        </span>
      </sub>
    </span>
  );
}
