package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"mushroom-farm/graph/auth"
	"mushroom-farm/graph/database"
	"mushroom-farm/graph/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal(err)
	}

	// Create router
	router := chi.NewRouter()

	// CORS middleware
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Requested-With"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Auth middleware
	router.Use(auth.AuthMiddleware)

	// GraphQL handler
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// GraphQL endpoint
	router.Handle("/graphql", srv)

	// GraphQL Playground (development only)
	if os.Getenv("ENV") != "production" {
		router.Handle("/playground", playground.Handler("GraphQL playground", "/graphql"))
	}

	// Health check
	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"status":"ok"}`)
	})

	port := ":8000"
	log.Printf("🚀 GraphQL server ready at http://localhost:8000/graphql")
	log.Printf("📊 GraphQL playground available at http://localhost:8000/playground")
	log.Fatal(http.ListenAndServe(port, router))
}
