
import type React from "react"

import { Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { login } from "../../actions"

export default function LoginPage() {

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-[#1a2235] rounded-lg">
        <div className="flex flex-col items-center justify-center mb-6">
          <Key className="h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold text-center">Login com API Key</h1>
          <p className="text-gray-400 text-center mt-2">Insira sua chave de API para acessar o sistema</p>
        </div>

        <form className="space-y-6" action={login}>
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                name="apiKey"
                placeholder="Digite sua API Key"
                required
                className="bg-[#1e293b] border-gray-700"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
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
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/registro" className="text-blue-400 hover:underline text-sm">
            Precisa de uma API Key? Registre-se aqui
          </Link>
        </div>
      </div>
    </div>
  )
}

