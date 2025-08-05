import { NotepadText } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 h-12 border border-x-0 border-t-0">
      <Link href="/" className="">
        <NotepadText />
      </Link>
      <ul className="flex gap-2">
        <li>
          <Link href="">Meus Formulários</Link>
        </li>
        <li>
          <Link href="">Criar formulário</Link>
        </li>
      </ul>
    </header>
  );
}
