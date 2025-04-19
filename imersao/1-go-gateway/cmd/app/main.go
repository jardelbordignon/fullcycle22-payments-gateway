package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/repository"
	"github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/service"
	serverPkg "github.com/jardelbordignon/fullcycle22-payments-gateway/imersao/go-gateway/internal/web/server"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func getEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Environment variable %s not set", key)
	}
	return value
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbConnStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST"),
		getEnv("DB_PORT"),
		getEnv("DB_USER"),
		getEnv("DB_PASS"),
		getEnv("DB_NAME"),
		getEnv("DB_SSL_MODE"),
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

	port := getEnv("HTTP_PORT")
	server := serverPkg.NewServer(accountService, port)
	server.ConfigureRoutes()

	err = server.Start()

	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	} else {
		fmt.Println("Server started on port", port)
	}

}
