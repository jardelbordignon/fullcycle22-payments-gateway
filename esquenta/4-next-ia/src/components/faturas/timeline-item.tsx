interface TimelineItemProps {
  status: "aprovado" | "pendente" | "rejeitado" | "info"
  title: string
  date: string
}

export function TimelineItem({ status, title, date }: TimelineItemProps) {
  const statusConfig = {
    aprovado: {
      color: "bg-green-500",
      icon: (
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
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ),
    },
    pendente: {
      color: "bg-yellow-500",
      icon: (
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
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    rejeitado: {
      color: "bg-red-500",
      icon: (
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
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      color: "bg-blue-500",
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
  }

  const config = statusConfig[status]

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${config.color} text-white`}>
          {config.icon}
        </div>
        {status !== "info" && <div className="w-px h-full bg-gray-700 mt-2"></div>}
      </div>
      <div className="pb-6">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
    </div>
  )
}

