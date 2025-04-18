import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Lock } from "lucide-react"
import { faturasData } from "@/data/faturas"

export default async function PagamentoPage({ params }: { params: Promise<{ id: string }> }) {

  const {id} = await params;

  // Encontrar a fatura pelo ID ou usar a primeira como fallback
  const fatura = faturasData.find((f) => f.id === id) || faturasData[0]

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Simulação de pagamento
  // }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/faturas" className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Realizar Pagamento</h1>
      </div>
      <p className="text-gray-400">Preencha os dados do cartão para processar o pagamento</p>

      <div className="bg-[#1a2235] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-400">Total a pagar</p>
            <p className="text-3xl font-bold">R$ {fatura.valor.toFixed(2).replace(".", ",")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Invoice</p>
            <p className="text-gray-300">#{fatura.id}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="numeroCartao" className="block text-sm font-medium mb-1">
              Número do Cartão
            </label>
            <div className="relative">
              <Input
                id="numeroCartao"
                type="text"
                placeholder="1234 5678 9012 3456"
                className="bg-[#1e293b] border-gray-700 pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" rx="2" fill="#1A1F36" />
                  <path d="M9 5H15V11H9V5Z" fill="#FFB600" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" rx="2" fill="#1A1F36" />
                  <path d="M9 5H15V8H9V5Z" fill="#6772E5" />
                  <path d="M9 8H15V11H9V8Z" fill="#87BBFD" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="nomeTitular" className="block text-sm font-medium mb-1">
              Nome do Titular
            </label>
            <Input
              id="nomeTitular"
              type="text"
              placeholder="Como está no cartão"
              className="bg-[#1e293b] border-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataValidade" className="block text-sm font-medium mb-1">
                Data de Validade
              </label>
              <Input id="dataValidade" type="text" placeholder="MM/AA" className="bg-[#1e293b] border-gray-700" />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                CVV
              </label>
              <Input id="cvv" type="text" placeholder="123" className="bg-[#1e293b] border-gray-700" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="salvarCartao"
            />
            <label
              htmlFor="salvarCartao"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Salvar cartão para futuras compras
            </label>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Lock className="h-4 w-4 mr-2" />
            Pagar R$ {fatura.valor.toFixed(2).replace(".", ",")}
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-center text-sm text-gray-400">
        <Lock className="h-4 w-4 mr-2" />
        <span>Seus dados estão protegidos com criptografia de ponta a ponta</span>
      </div>
    </div>
  )
}

//React Server Component - cache componente ou página, processamento do lado do servidor
//Client Component - 
