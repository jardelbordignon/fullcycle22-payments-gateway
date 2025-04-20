package server

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/web/handlers"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/web/middleware"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	accountService *service.AccountService
	invoiceService *service.InvoiceService
	port           string
}

func NewServer(accountService *service.AccountService, invoiceService *service.InvoiceService, port string) *Server {
	return &Server{
		router:         chi.NewRouter(),
		accountService: accountService,
		invoiceService: invoiceService,
		port:           port,
	}
}

func (server *Server) ConfigureRoutes() {
	accountHandler := handlers.NewAccountHandler(server.accountService)
	invoiceHandler := handlers.NewInvoiceHandler(server.invoiceService)

	server.router.Post("/accounts", accountHandler.Create)
	server.router.Get("/accounts", accountHandler.Get)

	authMiddleware := middleware.NewAuthMiddleware(server.accountService)
	server.router.Group(func(chiRouter chi.Router) {
		chiRouter.Use(authMiddleware.Authenticate)
		server.router.Post("/invoice", invoiceHandler.Create)
		server.router.Get("/invoice/{id}", invoiceHandler.GetById)
		server.router.Get("/invoice", invoiceHandler.GetAllByAccount)
	})
}

func (server *Server) Start() error {
	server.ConfigureRoutes()

	server.server = &http.Server{
		Addr:    ":" + server.port,
		Handler: server.router,
	}

	fmt.Println("Server started on", server.server.Addr)

	return server.server.ListenAndServe()
}

func (server *Server) Stop() error {
	return server.server.Close()
}
