package repository

import (
	"database/sql"
	"time"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/domain"
)

type AccountRepository struct {
	db *sql.DB
}

func NewAccountRepository(db *sql.DB) *AccountRepository {
	return &AccountRepository{db: db}
}

func (repository *AccountRepository) Create(account *domain.Account) error {
	query := `
	INSERT INTO accounts (id, name, email, api_key, balance, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

	stmt, err := repository.db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close() // Close the statement after use

	_, err = stmt.Exec(
		account.ID,
		account.Name,
		account.Email,
		account.APIKey,
		account.Balance,
		account.CreatedAt,
		account.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (repository *AccountRepository) findOne(param, value string) (*domain.Account, error) {
	query := `
	SELECT id, name, email, api_key, balance, created_at, updated_at
	FROM accounts 
	WHERE ` + param + ` = $1`

	var account domain.Account
	var createdAt, updatedAt time.Time

	err := repository.db.QueryRow(query, value).Scan(
		&account.ID,
		&account.Name,
		&account.Email,
		&account.APIKey,
		&account.Balance,
		&createdAt,
		&updatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, domain.ErrAccountNotFound
	} else if err != nil {
		return nil, err
	}

	account.CreatedAt = createdAt
	account.UpdatedAt = updatedAt

	return &account, nil
}

func (repository *AccountRepository) GetByAPIKey(apiKey string) (*domain.Account, error) {
	return repository.findOne(`api_key`, apiKey)
}

func (repository *AccountRepository) GetById(id string) (*domain.Account, error) {
	return repository.findOne(`id`, id)
}

func (repository *AccountRepository) UpdateBalance(account *domain.Account) error {
	tx, err := repository.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// FOR UPDATE preventing concurrent modifications
	selectBalanceQuery := `SELECT balance FROM accounts WHERE id = $1 FOR UPDATE`

	var currentBalance float64
	err = tx.QueryRow(selectBalanceQuery, account.ID).Scan(&currentBalance)

	if err == sql.ErrNoRows {
		return domain.ErrAccountNotFound
	} else if err != nil {
		return err
	}

	updateBalanceQuery := `UPDATE accounts SET balance = $1, updated_at = $2 WHERE id = $3`
	_, err = tx.Exec(updateBalanceQuery, account.Balance, time.Now(), account.ID)

	if err != nil {
		return err
	}

	return tx.Commit()
}
