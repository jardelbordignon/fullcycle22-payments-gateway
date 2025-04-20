package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/dto"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
)

type InvoiceHandler struct {
	service *service.InvoiceService
}

func NewInvoiceHandler(service *service.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{
		service: service,
	}
}

func (handler *InvoiceHandler) Create(res http.ResponseWriter, req *http.Request) {
	var input dto.InvoiceInput
	err := json.NewDecoder(req.Body).Decode(&input)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	input.APIKey = req.Header.Get("X-API-KEY")

	output, err := handler.service.Create(input)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusCreated)
	json.NewEncoder(res).Encode(output)
}

func (handler *InvoiceHandler) GetById(res http.ResponseWriter, req *http.Request) {
	//id := req.URL.Query().Get("id")
	id := chi.URLParam(req, "id")
	if id == "" {
		http.Error(res, "ID is required", http.StatusBadRequest)
		return
	}

	apiKey := req.Header.Get("X-API-KEY")
	output, err := handler.service.GetByID(id, apiKey)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	json.NewEncoder(res).Encode(output)
}

func (handler *InvoiceHandler) GetAllByAccount(res http.ResponseWriter, req *http.Request) {
	apiKey := req.Header.Get("X-API-KEY")
	if apiKey == "" {
		http.Error(res, "X-API-KEY header is required", http.StatusUnauthorized)
		return
	}

	output, err := handler.service.GetAllByAPIKey(apiKey)
	if err != nil {
		switch err {
		case domain.ErrAccountNotFound:
			http.Error(res, err.Error(), http.StatusNotFound)
			return
		default:
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(output)
}
