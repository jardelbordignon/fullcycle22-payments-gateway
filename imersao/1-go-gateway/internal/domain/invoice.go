package domain

import (
	"math/rand"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/util"
)

type Status string

const (
	StatusPending  Status = "pending"
	StatusApproved Status = "approved"
	StatusRejected Status = "rejected"
)

type Invoice struct {
	ID             string    `json:"id"`
	AccountID      string    `json:"account_id"`
	Amount         float64   `json:"amount"`
	Status         Status    `json:"status"`
	Description    string    `json:"description"`
	PaymentType    string    `json:"payment_type"`
	CardLastDigits string    `json:"card_last_digits"`
	PaidAt         time.Time `json:"paid_at"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CreditCard struct {
	Number         string `json:"number"`
	CVV            string `json:"cvv"`
	ExpiryMonth    int    `json:"expiry_month"`
	ExpiryYear     int    `json:"expiry_year"`
	CardholderName string `json:"cardholder_name"`
}

func NewInvoice(accountID string, amount float64, description, paymentType string, creditCard CreditCard) (*Invoice, error) {
	if amount <= 0 {
		return nil, ErrInvalidAmount
	}

	lastDigits := creditCard.Number[len(creditCard.Number)-4:]

	return &Invoice{
		ID:             uuid.New().String(),
		AccountID:      accountID,
		Amount:         amount,
		Status:         StatusPending,
		Description:    description,
		PaymentType:    paymentType,
		CardLastDigits: lastDigits,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}, nil
}

func (invoice *Invoice) Process() error {
	maxFreeAmount, err := strconv.ParseFloat(util.GetEnv("MAX_FREE_AMOUNT"), 64)
	if err != nil {
		maxFreeAmount = 10000
	}

	if invoice.Amount > maxFreeAmount {
		return nil
	}

	randomSource := rand.New(rand.NewSource(time.Now().Unix()))
	if randomSource.Float64() <= 0.7 {
		invoice.Status = StatusApproved
	} else {
		invoice.Status = StatusRejected
	}

	return nil
}

func (invoice *Invoice) UpdateStatus(newStatus Status) error {
	if newStatus == StatusPending {
		return ErrInvalidStatus
	}

	invoice.Status = newStatus
	invoice.UpdatedAt = time.Now()
	if newStatus == StatusApproved {
		invoice.PaidAt = time.Now()
	}
	return nil
}
