package service

import (
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/dto"
)

type AccountService struct {
	accountRepository domain.AccountRepository
}

func NewAccountService(accountRepository domain.AccountRepository) *AccountService {
	return &AccountService{
		accountRepository: accountRepository,
	}
}

func (service *AccountService) Create(data dto.CreateAccount) (*dto.AccountOutput, error) {
	account := dto.ToNewAccount(data)

	existingAccount, err := service.accountRepository.GetByAPIKey(account.APIKey)
	if err != nil && err != domain.ErrAccountNotFound {
		return nil, err
	}

	if existingAccount != nil {
		return nil, domain.ErrDuplicatedAPIKey
	}

	err = service.accountRepository.Create(account)
	if err != nil {
		return nil, err
	}

	output := dto.ToAccountOutput(account)
	return &output, nil
}

func (service *AccountService) UpdateBalance(apiKey string, amount float64) (*dto.AccountOutput, error) {
	account, err := service.accountRepository.GetByAPIKey(apiKey)
	if err != nil {
		return nil, err
	}

	account.AddBalance(amount)
	err = service.accountRepository.UpdateBalance(account)
	if err != nil {
		return nil, err
	}

	output := dto.ToAccountOutput(account)
	return &output, nil
}

func (service *AccountService) getByParam(param, value string) (*dto.AccountOutput, error) {
	var account *domain.Account
	var err error

	switch param {
	case "api_key":
		account, err = service.accountRepository.GetByAPIKey(value)
	case "id":
		account, err = service.accountRepository.GetById(value)
	default:
		return nil, domain.ErrInvalidParameter
	}

	if err != nil {
		return nil, err
	}

	output := dto.ToAccountOutput(account)
	return &output, nil
}

func (service *AccountService) GetByAPIKey(apiKey string) (*dto.AccountOutput, error) {
	return service.getByParam("api_key", apiKey)
}

func (service *AccountService) GetByID(id string) (*dto.AccountOutput, error) {
	return service.getByParam("id", id)
}
