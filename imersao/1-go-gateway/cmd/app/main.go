package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/repository"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/util"
	serverPkg "github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/web/server"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbConnStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		util.GetEnv("DB_HOST"),
		util.GetEnv("DB_PORT"),
		util.GetEnv("DB_USER"),
		util.GetEnv("DB_PASS"),
		util.GetEnv("DB_NAME"),
		util.GetEnv("DB_SSL_MODE"),
	)

	database, err := sql.Open("postgres", dbConnStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	defer database.Close()

	err = database.Ping()
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}

	fmt.Println("Successfully connected to the database!")

	accountRepository := repository.NewAccountRepository(database)
	accountService := service.NewAccountService(accountRepository)

	invoiceRepository := repository.NewInvoiceRepository(database)
	invoiceService := service.NewInvoiceService(invoiceRepository, *accountService)

	port := util.GetEnv("HTTP_PORT")
	server := serverPkg.NewServer(accountService, invoiceService, port)
	server.ConfigureRoutes()

	err = server.Start()

	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}

}
