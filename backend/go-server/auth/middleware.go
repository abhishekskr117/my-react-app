package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
)

// ContextKey is a custom type for context keys
type ContextKey string

const UserCtxKey ContextKey = "user"

// Middleware for JWT authentication
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		claims, err := VerifyToken(parts[1])
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserCtxKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromCtx retrieves user claims from context
func GetUserFromCtx(ctx context.Context) (*Claims, error) {
	user, ok := ctx.Value(UserCtxKey).(*Claims)
	if !ok {
		return nil, fmt.Errorf("user not found in context")
	}
	return user, nil
}
