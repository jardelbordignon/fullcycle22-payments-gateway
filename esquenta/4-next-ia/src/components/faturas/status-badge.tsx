interface StatusBadgeProps {
  status: "aprovado" | "pendente" | "rejeitado"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    aprovado: {
      label: "Aprovado",
      className: "bg-green-900/30 text-green-400 border border-green-700",
    },
    pendente: {
      label: "Pendente",
      className: "bg-yellow-900/30 text-yellow-400 border border-yellow-700",
    },
    rejeitado: {
      label: "Rejeitado",
      className: "bg-red-900/30 text-red-400 border border-red-700",
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

