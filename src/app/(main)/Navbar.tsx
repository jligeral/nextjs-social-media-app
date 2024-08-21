import Link from "next/link";
import UserButton from "@/components/UserButton";
import SearchField from "@/components/SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          bugbook
        </Link>
        <SearchField />
        <UserButton className="sm: ms-auto"/>
      </div>
    </header>
  )
}
