import { NotepadText } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 h-12 border border-x-0 border-t-0">
      <Link href="/" >
        <NotepadText />
        
      </Link>
      
    </header>
  );
}
