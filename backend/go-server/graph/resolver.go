package graph

import (
	"context"
	"fmt"
	"mushroom-farm/graph/auth"
	"mushroom-farm/graph/database"
	"mushroom-farm/graph/models"
)

// Resolver is the root resolver
type Resolver struct{}

// Query resolvers
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolver) Inventory() InventoryResolver {
	return &inventoryResolver{r}
}

func (r *Resolver) Order() OrderResolver {
	return &orderResolver{r}
}

func (r *Resolver) Sale() SaleResolver {
	return &saleResolver{r}
}

func (r *Resolver) User() UserResolver {
	return &userResolver{r}
}

func (r *Resolver) WorkOrder() WorkOrderResolver {
	return &workOrderResolver{r}
}

// Query resolver implementation
type queryResolver struct{ *Resolver }

func (r *queryResolver) Me(ctx context.Context) (*models.User, error) {
	claims, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user, ok := database.Store.GetUser(claims.UserID)
	if !ok {
		return nil, fmt.Errorf("user not found")
	}
	return toModelUser(user), nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*models.User, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	users := database.Store.GetAllUsers()
	result := make([]*models.User, len(users))
	for i, u := range users {
		result[i] = toModelUser(u)
	}
	return result, nil
}

func (r *queryResolver) Inventory(ctx context.Context) ([]*models.Inventory, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	items := database.Store.GetAllInventory()
	result := make([]*models.Inventory, len(items))
	for i, item := range items {
		result[i] = toModelInventory(item)
	}
	return result, nil
}

func (r *queryResolver) InventoryByID(ctx context.Context, id int) (*models.Inventory, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	item, ok := database.Store.GetInventory(id)
	if !ok {
		return nil, fmt.Errorf("inventory not found")
	}
	return toModelInventory(item), nil
}

func (r *queryResolver) Sales(ctx context.Context) ([]*models.Sale, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	sales := database.Store.GetAllSales()
	result := make([]*models.Sale, len(sales))
	for i, sa := range sales {
		result[i] = toModelSale(sa)
	}
	return result, nil
}

func (r *queryResolver) SaleByID(ctx context.Context, id int) (*models.Sale, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	sale, ok := database.Store.GetSale(id)
	if !ok {
		return nil, fmt.Errorf("sale not found")
	}
	return toModelSale(sale), nil
}

func (r *queryResolver) Orders(ctx context.Context) ([]*models.Order, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	orders := database.Store.GetAllOrders()
	result := make([]*models.Order, len(orders))
	for i, o := range orders {
		result[i] = toModelOrder(o)
	}
	return result, nil
}

func (r *queryResolver) OrderByID(ctx context.Context, id int) (*models.Order, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	order, ok := database.Store.GetOrder(id)
	if !ok {
		return nil, fmt.Errorf("order not found")
	}
	return toModelOrder(order), nil
}

func (r *queryResolver) WorkOrders(ctx context.Context) ([]*models.WorkOrder, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	workOrders := database.Store.GetAllWorkOrders()
	result := make([]*models.WorkOrder, len(workOrders))
	for i, wo := range workOrders {
		result[i] = toModelWorkOrder(wo)
	}
	return result, nil
}

func (r *queryResolver) WorkOrderByID(ctx context.Context, id int) (*models.WorkOrder, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	workOrder, ok := database.Store.GetWorkOrder(id)
	if !ok {
		return nil, fmt.Errorf("work order not found")
	}
	return toModelWorkOrder(workOrder), nil
}

// Mutation resolver implementation
type mutationResolver struct{ *Resolver }

func (r *mutationResolver) Login(ctx context.Context, username string, password string) (*models.AuthPayload, error) {
	user, ok := database.Store.GetUserByUsername(username)
	if !ok {
		return nil, fmt.Errorf("invalid credentials")
	}

	if user.Password != password {
		return nil, fmt.Errorf("invalid credentials")
	}

	token, err := auth.GenerateTokenFromUser(user.Username, user.Role)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &models.AuthPayload{
		Token: token,
		User:  toModelUser(user),
	}, nil
}

func (r *mutationResolver) CreateInventory(ctx context.Context, input models.CreateInventoryInput) (*models.Inventory, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	item := database.Store.CreateInventory(input.Name, input.Quantity, input.Type)
	return toModelInventory(item), nil
}

func (r *mutationResolver) UpdateInventory(ctx context.Context, id int, input models.UpdateInventoryInput) (*models.Inventory, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var name, itemType string
	var quantity int
	if input.Name != nil {
		name = *input.Name
	}
	if input.Quantity != nil {
		quantity = *input.Quantity
	}
	if input.Type != nil {
		itemType = *input.Type
	}

	item, ok := database.Store.UpdateInventory(id, name, quantity, itemType)
	if !ok {
		return nil, fmt.Errorf("inventory not found")
	}
	return toModelInventory(item), nil
}

func (r *mutationResolver) DeleteInventory(ctx context.Context, id int) (bool, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return false, fmt.Errorf("unauthorized: %w", err)
	}

	return database.Store.DeleteInventory(id), nil
}

func (r *mutationResolver) CreateSale(ctx context.Context, input models.CreateSaleInput) (*models.Sale, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	sale := database.Store.CreateSale(input.Product, input.Quantity, input.Price, input.Date)
	return toModelSale(sale), nil
}

func (r *mutationResolver) UpdateSale(ctx context.Context, id int, input models.UpdateSaleInput) (*models.Sale, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var product, date string
	var quantity int
	var price float64
	if input.Product != nil {
		product = *input.Product
	}
	if input.Quantity != nil {
		quantity = *input.Quantity
	}
	if input.Price != nil {
		price = *input.Price
	}
	if input.Date != nil {
		date = *input.Date
	}

	sale, ok := database.Store.UpdateSale(id, product, quantity, price, date)
	if !ok {
		return nil, fmt.Errorf("sale not found")
	}
	return toModelSale(sale), nil
}

func (r *mutationResolver) CreateOrder(ctx context.Context, input models.CreateOrderInput) (*models.Order, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	order := database.Store.CreateOrder(input.Customer, input.Product, input.Quantity, input.Status)
	return toModelOrder(order), nil
}

func (r *mutationResolver) UpdateOrder(ctx context.Context, id int, input models.UpdateOrderInput) (*models.Order, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var customer, product, status string
	var quantity int
	if input.Customer != nil {
		customer = *input.Customer
	}
	if input.Product != nil {
		product = *input.Product
	}
	if input.Quantity != nil {
		quantity = *input.Quantity
	}
	if input.Status != nil {
		status = *input.Status
	}

	order, ok := database.Store.UpdateOrder(id, customer, product, quantity, status)
	if !ok {
		return nil, fmt.Errorf("order not found")
	}
	return toModelOrder(order), nil
}

func (r *mutationResolver) CreateWorkOrder(ctx context.Context, input models.CreateWorkOrderInput) (*models.WorkOrder, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var assignedTo string
	if input.AssignedTo != nil {
		assignedTo = *input.AssignedTo
	}
	wo := database.Store.CreateWorkOrder(input.Task, assignedTo, input.Status)
	return toModelWorkOrder(wo), nil
}

func (r *mutationResolver) UpdateWorkOrder(ctx context.Context, id int, input models.UpdateWorkOrderInput) (*models.WorkOrder, error) {
	_, err := auth.GetUserFromCtx(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var task, assignedTo, status string
	if input.Task != nil {
		task = *input.Task
	}
	if input.AssignedTo != nil {
		assignedTo = *input.AssignedTo
	}
	if input.Status != nil {
		status = *input.Status
	}

	wo, ok := database.Store.UpdateWorkOrder(id, task, assignedTo, status)
	if !ok {
		return nil, fmt.Errorf("work order not found")
	}
	return toModelWorkOrder(wo), nil
}

// Field resolvers for related types
type inventoryResolver struct{ *Resolver }

func (r *inventoryResolver) CreatedAt(ctx context.Context, obj *models.Inventory) (string, error) {
	return obj.CreatedAt, nil
}

type orderResolver struct{ *Resolver }

func (r *orderResolver) CreatedAt(ctx context.Context, obj *models.Order) (string, error) {
	return obj.CreatedAt, nil
}

type saleResolver struct{ *Resolver }

func (r *saleResolver) CreatedAt(ctx context.Context, obj *models.Sale) (string, error) {
	return obj.CreatedAt, nil
}

type userResolver struct{ *Resolver }

func (r *userResolver) CreatedAt(ctx context.Context, obj *models.User) (string, error) {
	return obj.CreatedAt, nil
}

type workOrderResolver struct{ *Resolver }

func (r *workOrderResolver) CreatedAt(ctx context.Context, obj *models.WorkOrder) (string, error) {
	return obj.CreatedAt, nil
}

// Helper functions to convert database types to model types
func toModelUser(u database.User) *models.User {
	return &models.User{
		ID:       u.ID,
		Username: u.Username,
		Password: u.Password,
		Role:     u.Role,
	}
}

func toModelInventory(i database.Inventory) *models.Inventory {
	return &models.Inventory{
		ID:        i.ID,
		Name:      i.Name,
		Quantity:  i.Quantity,
		Type:      i.Type,
		CreatedAt: i.CreatedAt,
	}
}

func toModelSale(s database.Sale) *models.Sale {
	return &models.Sale{
		ID:        s.ID,
		Product:   s.Product,
		Quantity:  s.Quantity,
		Price:     s.Price,
		Date:      s.Date,
		CreatedAt: s.CreatedAt,
	}
}

func toModelOrder(o database.Order) *models.Order {
	return &models.Order{
		ID:        o.ID,
		Customer:  o.Customer,
		Product:   o.Product,
		Quantity:  o.Quantity,
		Status:    o.Status,
		CreatedAt: o.CreatedAt,
	}
}

func toModelWorkOrder(wo database.WorkOrder) *models.WorkOrder {
	return &models.WorkOrder{
		ID:         wo.ID,
		Task:       wo.Task,
		AssignedTo: wo.AssignedTo,
		Status:     wo.Status,
		CreatedAt:  wo.CreatedAt,
	}
}