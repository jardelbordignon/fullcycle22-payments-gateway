CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Insert some sample data
INSERT INTO products (name, description, price) VALUES
    ('Product 1', 'Description for product 1', 19.99),
    ('Product 2', 'Description for product 2', 29.99),
    ('Product 3', 'Description for product 3', 39.99); 
    