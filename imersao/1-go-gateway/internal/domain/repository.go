package domain

type AccountRepository interface {
	Create(account *Account) error
	GetByAPIKey(apiKey string) (*Account, error)
	GetById(id string) (*Account, error)
	UpdateBalance(account *Account) error
}

type InvoiceRepository interface {
	Create(invoice *Invoice) error
	GetById(id string) (*Invoice, error)
	GetByAccountId(accountId string) ([]*Invoice, error)
	UpdateStatus(invoice *Invoice) error
}
