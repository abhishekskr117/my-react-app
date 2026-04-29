package models

// User represents a user in the system
type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	Password  string `json:"-"`
	Role      string `json:"role"`
	CreatedAt string `json:"createdAt"`
}

// Inventory represents inventory items
type Inventory struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Quantity  int    `json:"quantity"`
	Type      string `json:"type"`
	CreatedAt string `json:"createdAt"`
}

// Sale represents a sale transaction
type Sale struct {
	ID        int     `json:"id"`
	Product   string  `json:"product"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Date      string  `json:"date"`
	CreatedAt string  `json:"createdAt"`
}

// Order represents a customer order
type Order struct {
	ID        int    `json:"id"`
	Customer  string `json:"customer"`
	Product   string `json:"product"`
	Quantity  int    `json:"quantity"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

// WorkOrder represents a work order task
type WorkOrder struct {
	ID         int    `json:"id"`
	Task       string `json:"task"`
	AssignedTo string `json:"assignedTo"`
	Status     string `json:"status"`
	CreatedAt  string `json:"createdAt"`
}

// AuthPayload represents the login response
type AuthPayload struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

// Input types for mutations
type CreateInventoryInput struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Type     string `json:"type"`
}

type UpdateInventoryInput struct {
	Name     *string `json:"name"`
	Quantity *int    `json:"quantity"`
	Type     *string `json:"type"`
}

type CreateSaleInput struct {
	Product  string  `json:"product"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Date     string  `json:"date"`
}

type UpdateSaleInput struct {
	Product  *string  `json:"product"`
	Quantity *int     `json:"quantity"`
	Price    *float64 `json:"price"`
	Date     *string  `json:"date"`
}

type CreateOrderInput struct {
	Customer string `json:"customer"`
	Product  string `json:"product"`
	Quantity int    `json:"quantity"`
	Status   string `json:"status"`
}

type UpdateOrderInput struct {
	Customer *string `json:"customer"`
	Product  *string `json:"product"`
	Quantity *int    `json:"quantity"`
	Status   *string `json:"status"`
}

type CreateWorkOrderInput struct {
	Task       string  `json:"task"`
	AssignedTo *string `json:"assignedTo"`
	Status     string  `json:"status"`
}

type UpdateWorkOrderInput struct {
	Task       *string `json:"task"`
	AssignedTo *string `json:"assignedTo"`
	Status     *string `json:"status"`
}