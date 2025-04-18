import { Button } from "@/components/ui/button"

export function FaturasListSkeleton() {
  // Create array for skeleton rows
  const skeletonRows = Array.from({ length: 10 }, (_, i) => i)

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
            {skeletonRows.map((index) => (
              <tr key={index} className="hover:bg-[#1e293b]">
                <td className="px-4 py-3 text-sm">
                  <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="h-4 w-36 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="h-6 w-24 bg-gray-700 rounded-full animate-pulse"></div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-800">
        <div className="h-4 w-60 bg-gray-700 rounded animate-pulse"></div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-[#1e293b] border-gray-700"
            disabled
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
              className="h-8 w-8 bg-[#1e293b] border-gray-700"
              disabled
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-[#1e293b] border-gray-700"
            disabled
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