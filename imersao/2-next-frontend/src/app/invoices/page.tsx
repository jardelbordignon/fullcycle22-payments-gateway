import { InvoiceList } from "@/components/partial/invoice/list"

export default function InvoiceListPage() {
  // Em uma aplicação real, verificaria se o usuário está autenticado
  // const isAuthenticated = checkAuth()
  // if (!isAuthenticated) redirect('/auth')

  return <InvoiceList />
}