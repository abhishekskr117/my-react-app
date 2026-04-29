package database

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"
)

var (
	once   sync.Once
	store  *DataStore
)

// Store exposes the DataStore for use by resolvers
var Store *DataStore

// DataStore is a simple JSON file-based storage
type DataStore struct {
	mu        sync.RWMutex
	filePath  string
	Users     map[int]User     `json:"users"`
	Inventory map[int]Inventory `json:"inventory"`
	Sales     map[int]Sale     `json:"sales"`
	Orders    map[int]Order    `json:"orders"`
	WorkOrders map[int]WorkOrder `json:"work_orders"`
	nextIDs   map[string]int
}

type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
}

type Inventory struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Quantity  int    `json:"quantity"`
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
}

type Sale struct {
	ID        int     `json:"id"`
	Product   string  `json:"product"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Date      string  `json:"date"`
	CreatedAt string  `json:"created_at"`
}

type Order struct {
	ID        int    `json:"id"`
	Customer  string `json:"customer"`
	Product   string `json:"product"`
	Quantity  int    `json:"quantity"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

type WorkOrder struct {
	ID         int    `json:"id"`
	Task       string `json:"task"`
	AssignedTo string `json:"assigned_to"`
	Status     string `json:"status"`
	CreatedAt  string `json:"created_at"`
}

// InitDB initializes the JSON file-based database
func InitDB() error {
	var err error
	once.Do(func() {
		store = &DataStore{
			filePath:   "mushroom_farm.json",
			Users:      make(map[int]User),
			Inventory:  make(map[int]Inventory),
			Sales:      make(map[int]Sale),
			Orders:     make(map[int]Order),
			WorkOrders: make(map[int]WorkOrder),
			nextIDs:    map[string]int{"users": 1, "inventory": 1, "sales": 1, "orders": 1, "work_orders": 1},
		}
		Store = store
		err = store.load()
	})
	if err != nil {
		return fmt.Errorf("failed to initialize database: %w", err)
	}
	log.Println("✅ Database initialized successfully")
	return nil
}

func (s *DataStore) load() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return s.seed()
		}
		return err
	}
	return json.Unmarshal(data, s)
}

func (s *DataStore) save() error {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

func (s *DataStore) seed() error {
	s.Users[1] = User{ID: 1, Username: "admin", Password: "admin123", Role: "admin", CreatedAt: time.Now().Format(time.RFC3339)}
	s.Inventory[1] = Inventory{ID: 1, Name: "Shiitake", Quantity: 100, Type: "Mushroom", CreatedAt: time.Now().Format(time.RFC3339)}
	s.Inventory[2] = Inventory{ID: 2, Name: "Oyster", Quantity: 50, Type: "Mushroom", CreatedAt: time.Now().Format(time.RFC3339)}
	s.Inventory[3] = Inventory{ID: 3, Name: "Substrate", Quantity: 200, Type: "Supply", CreatedAt: time.Now().Format(time.RFC3339)}
	s.Sales[1] = Sale{ID: 1, Product: "Shiitake", Quantity: 10, Price: 25.00, Date: time.Now().Format("2006-01-02"), CreatedAt: time.Now().Format(time.RFC3339)}
	s.Sales[2] = Sale{ID: 2, Product: "Oyster", Quantity: 20, Price: 15.00, Date: time.Now().Format("2006-01-02"), CreatedAt: time.Now().Format(time.RFC3339)}
	s.Orders[1] = Order{ID: 1, Customer: "John Doe", Product: "Shiitake", Quantity: 5, Status: "pending", CreatedAt: time.Now().Format(time.RFC3339)}
	s.Orders[2] = Order{ID: 2, Customer: "Jane Smith", Product: "Oyster", Quantity: 10, Status: "completed", CreatedAt: time.Now().Format(time.RFC3339)}
	s.WorkOrders[1] = WorkOrder{ID: 1, Task: "Check humidity levels", AssignedTo: "admin", Status: "pending", CreatedAt: time.Now().Format(time.RFC3339)}
	s.WorkOrders[2] = WorkOrder{ID: 2, Task: "Water substrate", AssignedTo: "", Status: "pending", CreatedAt: time.Now().Format(time.RFC3339)}
	s.nextIDs = map[string]int{"users": 2, "inventory": 4, "sales": 3, "orders": 3, "work_orders": 3}
	log.Println("Seeding initial data...")
	return s.save()
}

// User operations
func (s *DataStore) GetUser(id int) (User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.Users[id]
	return u, ok
}

func (s *DataStore) GetUserByUsername(username string) (User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, u := range s.Users {
		if u.Username == username {
			return u, true
		}
	}
	return User{}, false
}

func (s *DataStore) GetAllUsers() []User {
	s.mu.RLock()
	defer s.mu.RUnlock()
	users := make([]User, 0, len(s.Users))
	for _, u := range s.Users {
		users = append(users, u)
	}
	return users
}

// Inventory operations
func (s *DataStore) GetInventory(id int) (Inventory, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	i, ok := s.Inventory[id]
	return i, ok
}

func (s *DataStore) GetAllInventory() []Inventory {
	s.mu.RLock()
	defer s.mu.RUnlock()
	items := make([]Inventory, 0, len(s.Inventory))
	for _, i := range s.Inventory {
		items = append(items, i)
	}
	return items
}

func (s *DataStore) CreateInventory(name string, quantity int, itemType string) Inventory {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.nextIDs["inventory"]
	s.nextIDs["inventory"]++
	item := Inventory{ID: id, Name: name, Quantity: quantity, Type: itemType, CreatedAt: time.Now().Format(time.RFC3339)}
	s.Inventory[id] = item
	s.save()
	return item
}

func (s *DataStore) UpdateInventory(id int, name string, quantity int, itemType string) (Inventory, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if item, ok := s.Inventory[id]; ok {
		if name != "" {
			item.Name = name
		}
		if quantity > 0 {
			item.Quantity = quantity
		}
		if itemType != "" {
			item.Type = itemType
		}
		s.Inventory[id] = item
		s.save()
		return item, true
	}
	return Inventory{}, false
}

func (s *DataStore) DeleteInventory(id int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.Inventory[id]; ok {
		delete(s.Inventory, id)
		s.save()
		return true
	}
	return false
}

// Sales operations
func (s *DataStore) GetSale(id int) (Sale, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sa, ok := s.Sales[id]
	return sa, ok
}

func (s *DataStore) GetAllSales() []Sale {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sales := make([]Sale, 0, len(s.Sales))
	for _, sa := range s.Sales {
		sales = append(sales, sa)
	}
	return sales
}

func (s *DataStore) CreateSale(product string, quantity int, price float64, date string) Sale {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.nextIDs["sales"]
	s.nextIDs["sales"]++
	sale := Sale{ID: id, Product: product, Quantity: quantity, Price: price, Date: date, CreatedAt: time.Now().Format(time.RFC3339)}
	s.Sales[id] = sale
	s.save()
	return sale
}

func (s *DataStore) UpdateSale(id int, product string, quantity int, price float64, date string) (Sale, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if sale, ok := s.Sales[id]; ok {
		if product != "" {
			sale.Product = product
		}
		if quantity > 0 {
			sale.Quantity = quantity
		}
		if price > 0 {
			sale.Price = price
		}
		if date != "" {
			sale.Date = date
		}
		s.Sales[id] = sale
		s.save()
		return sale, true
	}
	return Sale{}, false
}

// Order operations
func (s *DataStore) GetOrder(id int) (Order, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	o, ok := s.Orders[id]
	return o, ok
}

func (s *DataStore) GetAllOrders() []Order {
	s.mu.RLock()
	defer s.mu.RUnlock()
	orders := make([]Order, 0, len(s.Orders))
	for _, o := range s.Orders {
		orders = append(orders, o)
	}
	return orders
}

func (s *DataStore) CreateOrder(customer, product string, quantity int, status string) Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.nextIDs["orders"]
	s.nextIDs["orders"]++
	order := Order{ID: id, Customer: customer, Product: product, Quantity: quantity, Status: status, CreatedAt: time.Now().Format(time.RFC3339)}
	s.Orders[id] = order
	s.save()
	return order
}

func (s *DataStore) UpdateOrder(id int, customer, product string, quantity int, status string) (Order, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if order, ok := s.Orders[id]; ok {
		if customer != "" {
			order.Customer = customer
		}
		if product != "" {
			order.Product = product
		}
		if quantity > 0 {
			order.Quantity = quantity
		}
		if status != "" {
			order.Status = status
		}
		s.Orders[id] = order
		s.save()
		return order, true
	}
	return Order{}, false
}

// WorkOrder operations
func (s *DataStore) GetWorkOrder(id int) (WorkOrder, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	wo, ok := s.WorkOrders[id]
	return wo, ok
}

func (s *DataStore) GetAllWorkOrders() []WorkOrder {
	s.mu.RLock()
	defer s.mu.RUnlock()
	workOrders := make([]WorkOrder, 0, len(s.WorkOrders))
	for _, wo := range s.WorkOrders {
		workOrders = append(workOrders, wo)
	}
	return workOrders
}

func (s *DataStore) CreateWorkOrder(task, assignedTo, status string) WorkOrder {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.nextIDs["work_orders"]
	s.nextIDs["work_orders"]++
	wo := WorkOrder{ID: id, Task: task, AssignedTo: assignedTo, Status: status, CreatedAt: time.Now().Format(time.RFC3339)}
	s.WorkOrders[id] = wo
	s.save()
	return wo
}

func (s *DataStore) UpdateWorkOrder(id int, task, assignedTo, status string) (WorkOrder, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if wo, ok := s.WorkOrders[id]; ok {
		if task != "" {
			wo.Task = task
		}
		if assignedTo != "" {
			wo.AssignedTo = assignedTo
		}
		if status != "" {
			wo.Status = status
		}
		s.WorkOrders[id] = wo
		s.save()
		return wo, true
	}
	return WorkOrder{}, false
}