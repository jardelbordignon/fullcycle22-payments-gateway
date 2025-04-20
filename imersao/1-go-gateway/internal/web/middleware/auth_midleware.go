package middleware

import (
	"net/http"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
)

type AuthMiddleware struct {
	accountService *service.AccountService
}

func NewAuthMiddleware(accountService *service.AccountService) *AuthMiddleware {
	return &AuthMiddleware{
		accountService: accountService,
	}
}

func (authMiddleware *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		apiKey := req.Header.Get("X-API-KEY")
		if apiKey == "" {
			http.Error(res, "X-API-KEY header is required", http.StatusUnauthorized)
			return
		}

		_, err := authMiddleware.accountService.GetByAPIKey(apiKey)
		if err != nil {
			if err == domain.ErrAccountNotFound {
				http.Error(res, "Invalid API Key", http.StatusUnauthorized)
				return
			}
			http.Error(res, "Internal Server Error", http.StatusInternalServerError)
		}

		next.ServeHTTP(res, req)
	})
}
