package service

import (
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/dto"
)

type InvoiceService struct {
	invoiceRepository domain.InvoiceRepository
	accountService    AccountService
}

func NewInvoiceService(invoiceRepository domain.InvoiceRepository, accountService AccountService) *InvoiceService {
	return &InvoiceService{
		invoiceRepository: invoiceRepository,
		accountService:    accountService,
	}
}

func (service *InvoiceService) Create(input dto.InvoiceInput) (*dto.InvoiceOutput, error) {
	accountOutput, err := service.accountService.GetByAPIKey(input.APIKey)
	if err != nil {
		return nil, err
	}

	invoice, err := dto.ToInvoice(input, accountOutput.ID)
	if err != nil {
		return nil, err
	}

	err = invoice.Process()
	if err != nil {
		return nil, err
	}

	// For approved transactions, update the account balance
	if invoice.Status == domain.StatusApproved {
		_, err = service.accountService.UpdateBalance(input.APIKey, invoice.Amount)
		if err != nil {
			return nil, err
		}
	}

	err = service.invoiceRepository.Create(invoice)
	if err != nil {
		return nil, err
	}

	return dto.ToOutput(invoice), nil
}

func (service *InvoiceService) GetByID(id, apiKey string) (*dto.InvoiceOutput, error) {
	invoice, err := service.invoiceRepository.GetById(id)
	if err != nil {
		return nil, err
	}

	accountOutput, err := service.accountService.GetByAPIKey(apiKey)
	if err != nil {
		return nil, err
	}

	if invoice.AccountID != accountOutput.ID {
		return nil, domain.ErrUnauthorizedAccess
	}

	return dto.ToOutput(invoice), nil
}

func (service *InvoiceService) GetByAccountID(accountId string) ([]*dto.InvoiceOutput, error) {
	invoices, err := service.invoiceRepository.GetByAccountId(accountId)
	if err != nil {
		return nil, err
	}

	// var output []*dto.InvoiceOutput
	// for _, invoice := range invoices {
	// 	output = append(output, dto.ToOutput(invoice))
	// }
	output := make([]*dto.InvoiceOutput, len(invoices))
	for i, invoice := range invoices {
		output[i] = dto.ToOutput(invoice)
	}

	return output, nil
}

func (service *InvoiceService) GetAllByAPIKey(apiKey string) ([]*dto.InvoiceOutput, error) {
	accountOutput, err := service.accountService.GetByAPIKey(apiKey)
	if err != nil {
		return nil, err
	}

	return service.GetByAccountID(accountOutput.ID)
}
