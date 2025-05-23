import { cookies } from "next/headers";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { logoutServerAction } from "@/lib/server-actions/login/authentication";

export async function Header() {
  const cookiesStore = await cookies();

  const isAuthPage = cookiesStore.get("apiKey")?.value !== undefined;

  return (
    <header className="bg-[#1a2332] border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Full Cycle Gateway
        </Link>

        {isAuthPage && (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Olá, usuário</span>
            <form action={logoutServerAction}>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}