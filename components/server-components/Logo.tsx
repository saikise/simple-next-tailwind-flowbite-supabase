import Link from "next/link";

export default function Logo() {
  return (
    <span className="self-center font-semibold whitespace-nowrap dark:text-white">
      <span className="hover:text-gray-400 transition-colors duration-200">
        <Link href="/">Next.js Supabase Template</Link>
      </span>{" "}
      <sub>
        <span className="hover:text-gray-400 transition-colors duration-200">
          <Link href="https://saikise.com">by sai kise</Link>
        </span>
      </sub>
    </span>
  );
}
