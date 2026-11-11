import Link from "next/link";
import MenuHamburguesa from "./MenuHamburguesa";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#263049] bg-[#07090f]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-[1.8rem] font-extrabold text-white">
          Off<span className="text-blue-400">ero</span>
        </Link>
        <MenuHamburguesa />
      </nav>
    </header>
  );
}