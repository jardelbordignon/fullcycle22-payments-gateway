import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaturasList } from "@/components/faturas/faturas-list";
import { Plus, Filter } from "lucide-react";
import { Suspense } from "react";
import { FaturasListSkeleton } from "../../components/skeletons/faturas-list-skeleton";

export default async function FaturasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Faturas</h1>
          <p className="text-gray-400">Gerencie suas transações</p>
        </div>
        <Link href="/faturas/nova">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </Link>
      </div>

      <div className="bg-[#1a2235] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full bg-[#1e293b] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="todos">Todos</option>
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dataInicial"
              className="block text-sm font-medium mb-1"
            >
              Data Inicial
            </label>
            <Input
              id="dataInicial"
              type="text"
              placeholder="dd/mm/aaaa"
              className="bg-[#1e293b] border-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="dataFinal"
              className="block text-sm font-medium mb-1"
            >
              Data Final
            </label>
            <Input
              id="dataFinal"
              type="text"
              placeholder="dd/mm/aaaa"
              className="bg-[#1e293b] border-gray-700"
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-[#1e293b] hover:bg-[#2d3748] border border-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>
      </div>
      <Suspense fallback={<FaturasListSkeleton />}>
        <FaturasList />
      </Suspense>
    </div>
  );
}
