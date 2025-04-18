import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, CreditCard, Info } from "lucide-react"

export default function NovaFaturaPage() {
  const router = useRouter()
  const [tipoPagamento, setTipoPagamento] = useState<"cartao" | "pix">("cartao")
  const [notificacoes, setNotificacoes] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de criação de fatura
    router.push("/faturas")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/faturas" className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Criar Nova Fatura</h1>
      </div>
      <p className="text-gray-400">Preencha os dados para gerar uma nova fatura</p>

      <div className="bg-[#1a2235] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="valor" className="block text-sm font-medium mb-1">
                Valor da Fatura
              </label>
              <Input id="valor" type="text" placeholder="R$ 0,00" className="bg-[#1e293b] border-gray-700" />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <Textarea
                id="descricao"
                placeholder="Descreva o propósito desta fatura"
                className="bg-[#1e293b] border-gray-700 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Pagamento</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center justify-center p-3 rounded-md border ${
                    tipoPagamento === "cartao" ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-[#1e293b]"
                  }`}
                  onClick={() => setTipoPagamento("cartao")}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Cartão de Crédito
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center p-3 rounded-md border ${
                    tipoPagamento === "pix" ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-[#1e293b]"
                  }`}
                  onClick={() => setTipoPagamento("pix")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M7.5 4.5L4.5 7.5L7.5 10.5L10.5 7.5L7.5 4.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 4.5L13.5 7.5L16.5 10.5L19.5 7.5L16.5 4.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 13.5L4.5 16.5L7.5 19.5L10.5 16.5L7.5 13.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 13.5L13.5 16.5L16.5 19.5L19.5 16.5L16.5 13.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Pix
                </button>
              </div>
            </div>

            {tipoPagamento === "cartao" && (
              <>
                <div>
                  <label htmlFor="numeroCartao" className="block text-sm font-medium mb-1">
                    Número do Cartão
                  </label>
                  <Input
                    id="numeroCartao"
                    type="text"
                    placeholder="4111 1111 1111 1111"
                    className="bg-[#1e293b] border-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="nomeTitular" className="block text-sm font-medium mb-1">
                    Nome do Titular
                  </label>
                  <Input
                    id="nomeTitular"
                    type="text"
                    placeholder="Como aparece no cartão"
                    className="bg-[#1e293b] border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dataExpiracao" className="block text-sm font-medium mb-1">
                      Data de Expiração
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="bg-[#1e293b] border border-gray-700 rounded-md p-2 text-white">
                        <option value="">Mês</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {month.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <select className="bg-[#1e293b] border border-gray-700 rounded-md p-2 text-white">
                        <option value="">Ano</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                      CVV
                    </label>
                    <Input id="cvv" type="text" placeholder="123" className="bg-[#1e293b] border-gray-700" />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="vencimento" className="text-sm font-medium">
                  Vencimento
                </label>
                <select className="bg-[#1e293b] border border-gray-700 rounded-md p-1 text-sm text-white">
                  <option value="24">24 horas</option>
                  <option value="48">48 horas</option>
                  <option value="72">72 horas</option>
                  <option value="168">7 dias</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Info className="h-4 w-4" />
                <span>Define por quanto tempo a fatura ficará ativa</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Notificações</div>
                <div className="text-sm text-gray-400">Enviar notificações sobre o status do pagamento</div>
              </div>
              <Switch checked={notificacoes} onCheckedChange={setNotificacoes} />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Gerar Fatura
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-[#1a2235] rounded-lg p-4 border border-gray-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium">Dica para Valores Altos</h3>
            <p className="text-sm text-gray-400">
              Faturas com valores acima de R$ 10.000,00 passarão por uma análise adicional de segurança antes da
              aprovação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

