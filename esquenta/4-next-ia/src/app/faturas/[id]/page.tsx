import Link from "next/link"
import { ArrowLeft, Printer, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/faturas/status-badge"
import { TimelineItem } from "@/components/faturas/timeline-item"
import { faturasData } from "@/data/faturas"

export default function DetalheFaturaPage({ params }: { params: { id: string } }) {
  const fatura = faturasData.find((f) => f.id === params.id) || faturasData[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/faturas" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar para lista</span>
          </Link>
          <h1 className="text-2xl font-bold">Fatura #{fatura.id}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-indigo-600 hover:bg-indigo-700 border-0">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="destructive">
            <Trash className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
      <p className="text-gray-400">Detalhes da transação</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a2235] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium">Status</h2>
                <StatusBadge status={fatura.status} />
              </div>
              <div className="text-right">
                <h2 className="text-lg font-medium">Valor</h2>
                <div className="text-2xl font-bold">R$ {fatura.valor.toFixed(2).replace(".", ",")}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2235] rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Detalhes da Transação</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">ID da Transação</h3>
                <p className="font-medium">{fatura.id}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Data</h3>
                <p className="font-medium">{fatura.data}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Descrição</h3>
                <p className="font-medium">{fatura.descricao}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Método de Pagamento</h3>
                <p className="font-medium">Cartão de Crédito</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2235] rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Dados do Pagamento</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Cartão</h3>
                <p className="font-medium">•••• •••• •••• 1111</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Titular</h3>
                <p className="font-medium">João Silva</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Validade</h3>
                <p className="font-medium">12/2025</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Bandeira</h3>
                <p className="font-medium">Visa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2235] rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Histórico</h2>
          <div className="space-y-6">
            <TimelineItem status="aprovado" title="Pagamento Aprovado" date="30/03/2025 14:32" />
            <TimelineItem status="pendente" title="Processando Pagamento" date="30/03/2025 14:31" />
            <TimelineItem status="info" title="Fatura Criada" date="30/03/2025 14:30" />
          </div>
        </div>
      </div>
    </div>
  )
}

