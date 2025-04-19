package domain

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"

	//"github.com/nrednav/cuid2"
	"github.com/google/uuid"
)

type Account struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	APIKey    string  `json:"api_key"`
	Balance   float64 `json:"balance"`
	mutex     sync.RWMutex
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func generateAPIKey() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

/*
A função NewAccount cria uma intância de Account que ficará armazenada em memória, o retorno *Account (ponteiro) indica justamente que o retorno é uma referência a memória alocada com a informação.
*/
func NewAccount(name, email string) *Account {
	account := &Account{
		//ID:        cuid2.Generate(),
		ID:        uuid.New().String(),
		Name:      name,
		Email:     email,
		Balance:   0,
		APIKey:    generateAPIKey(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return account
}

/*
Função para adicionar saldo na conta, a função utiliza um mutex para
garantir que o acesso ao saldo seja seguro em ambientes concorrentes.
*/
func (account *Account) AddBalance(amount float64) {
	account.mutex.Lock()         // Lock the mutex to prevent concurrent access
	defer account.mutex.Unlock() // Ensure the mutex is unlocked after the operation
	account.Balance += amount
	account.UpdatedAt = time.Now()
}
