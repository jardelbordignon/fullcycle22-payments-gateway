import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { logout } from "../actions";

export async function Header() {
  const cookiesStore = await cookies();
  const apiKey = cookiesStore.get("apiKey")?.value;

  return (
    <header className="bg-[#111827] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/faturas" className="text-xl font-bold">
          Full Cycle Gateway
        </Link>
        {apiKey && (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Olá, usuário</span>
            <form action={logout}>
              <Button variant="destructive" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
