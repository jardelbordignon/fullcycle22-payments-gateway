package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/web/handlers"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	accountService *service.AccountService
	port           string
}

func NewServer(accountService *service.AccountService, port string) *Server {
	return &Server{
		router:         chi.NewRouter(),
		accountService: accountService,
		port:           port,
	}
}

func (server *Server) ConfigureRoutes() {
	accountHandler := handlers.NewAccountHandler(server.accountService)
	server.router.Post("/accounts", accountHandler.Create)
	server.router.Get("/accounts", accountHandler.Get)
}

func (server *Server) Start() error {
	server.ConfigureRoutes()

	server.server = &http.Server{
		Addr:    ":" + server.port,
		Handler: server.router,
	}

	return server.server.ListenAndServe()
}

func (server *Server) Stop() error {
	return server.server.Close()
}
