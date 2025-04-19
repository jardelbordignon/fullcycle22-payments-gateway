package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/dto"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
)

type AccountHandler struct {
	accountService *service.AccountService
}

func NewAccountHandler(accountService *service.AccountService) *AccountHandler {
	return &AccountHandler{
		accountService: accountService,
	}
}

func (accountHandler *AccountHandler) Create(res http.ResponseWriter, req *http.Request) {
	var data dto.CreateAccount
	err := json.NewDecoder(req.Body).Decode(&data)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	accountOutput, err := accountHandler.accountService.Create(data)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusCreated)
	json.NewEncoder(res).Encode(accountOutput)
}

func (accountHandler *AccountHandler) Get(res http.ResponseWriter, req *http.Request) {
	apiKey := req.Header.Get("X-API-Key")
	if apiKey == "" {
		http.Error(res, "missing api key", http.StatusUnauthorized)
		return
	}

	accountOutput, err := accountHandler.accountService.GetByAPIKey(apiKey)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	json.NewEncoder(res).Encode(accountOutput)
}
