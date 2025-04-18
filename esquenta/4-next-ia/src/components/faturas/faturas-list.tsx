import Link from "next/link"
import { Eye, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/faturas/status-badge"
import { faturasData } from "@/data/faturas"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getFaturas(){ 
  await sleep(2000);
  return faturasData;
}

//cache
//renovação do cache sob demanda
//route handler /api/faturas/revalidate

export async function FaturasList() {
  const faturas = await getFaturas();
  //const itemsPerPage = 10
  //const totalPages = Math.ceil(faturasData.length / itemsPerPage)

  return (
    <div className="bg-[#1a2235] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1e293b] text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-sm font-medium">DESCRIÇÃO</th>
              <th className="px-4 py-3 text-sm font-medium">VALOR</th>
              <th className="px-4 py-3 text-sm font-medium">STATUS</th>
              <th className="px-4 py-3 text-sm font-medium">DATA</th>
              <th className="px-4 py-3 text-sm font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {faturas.map((fatura) => (
              <tr key={fatura.id} className="hover:bg-[#1e293b]">
                <td className="px-4 py-3 text-sm">{fatura.id}</td>
                <td className="px-4 py-3 text-sm">{fatura.descricao}</td>
                <td className="px-4 py-3 text-sm">R$ {fatura.valor.toFixed(2).replace(".", ",")}</td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={fatura.status} />
                </td>
                <td className="px-4 py-3 text-sm">{fatura.data}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <Link href={`/faturas/${fatura.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-800">
        <div className="text-sm text-gray-400">Mostrando 1 até 10 de 20 resultados</div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-[#1e293b] border-gray-700"
          >
            <span className="sr-only">Anterior</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              size="sm"
              // className={`h-8 w-8 ${currentPage === page ? "bg-blue-600" : "bg-[#1e293b] border-gray-700"}`}
              // onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-[#1e293b] border-gray-700"
            // disabled={currentPage === totalPages}
            // onClick={() => setCurrentPage(currentPage + 1)}
          >
            <span className="sr-only">Próximo</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

