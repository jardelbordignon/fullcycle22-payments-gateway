package repository

import (
	"database/sql"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
)

type InvoiceRepository struct {
	db *sql.DB
}

func NewInvoiceRepository(db *sql.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

func (repository *InvoiceRepository) Create(invoice *domain.Invoice) error {
	query := `
	INSERT INTO invoices (id, account_id, amount, status, description, payment_type, card_last_digits, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	_, err := repository.db.Exec(query, invoice.ID, invoice.AccountID, invoice.Amount, invoice.Status, invoice.Description, invoice.PaymentType, invoice.CardLastDigits, invoice.CreatedAt, invoice.UpdatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (repository *InvoiceRepository) GetById(id string) (*domain.Invoice, error) {
	query := `
	SELECT id, account_id, amount, status, description, payment_type, card_last_digits, created_at, updated_at
	FROM invoices WHERE id = $1`

	invoice := &domain.Invoice{}
	row := repository.db.QueryRow(query, id)
	err := row.Scan(
		&invoice.ID,
		&invoice.AccountID,
		&invoice.Amount,
		&invoice.Status,
		&invoice.Description,
		&invoice.PaymentType,
		&invoice.CardLastDigits,
		&invoice.CreatedAt,
		&invoice.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, domain.ErrInvoiceNotFound
	}

	if err != nil {
		return nil, err
	}

	return invoice, nil
}

func (repository *InvoiceRepository) GetByAccountId(accountId string) ([]*domain.Invoice, error) {
	query := `
	SELECT id, account_id, amount, status, description, payment_type, card_last_digits, created_at, updated_at
	FROM invoices WHERE account_id = $1`

	rows, err := repository.db.Query(query, accountId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	invoices := make([]*domain.Invoice, 0)
	for rows.Next() {
		invoice := &domain.Invoice{}
		err := rows.Scan(
			&invoice.ID,
			&invoice.AccountID,
			&invoice.Amount,
			&invoice.Status,
			&invoice.Description,
			&invoice.PaymentType,
			&invoice.CardLastDigits,
			&invoice.CreatedAt,
			&invoice.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		invoices = append(invoices, invoice)
	}

	return invoices, nil
}

func (repository *InvoiceRepository) UpdateStatus(invoice *domain.Invoice) error {
	query := `UPDATE invoices SET status = $1, paid_at = $2, updated_at = $3 WHERE id = $4`

	rows, err := repository.db.Exec(query, invoice.Status, invoice.PaidAt, invoice.UpdatedAt, invoice.ID)

	if err != nil {
		return err
	}

	rowsAffected, err := rows.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return domain.ErrInvoiceNotFound
	}

	return nil
}
