package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

type Server struct {
	ID          int     `json:"id"`
	Temperature float64 `json:"temperature"`
	IsOnline    bool    `json:"isOnline"`
}

var servers = []Server{
	{ID: 1, Temperature: 32, IsOnline: true},
	{ID: 2, Temperature: 38, IsOnline: true},
	{ID: 3, Temperature: 28, IsOnline: false},
}

func getServers(w http.ResponseWriter, r *http.Request) {
	// Simulasikan suhu berubah otomatis
	for i := range servers {
		if servers[i].IsOnline {
			servers[i].Temperature += rand.Float64()*2 - 1 // random +/- 1
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(servers)
}

func toggleServer(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/toggle/"):]
	id, _ := strconv.Atoi(idStr)

	for i := range servers {
		if servers[i].ID == id {
			servers[i].IsOnline = !servers[i].IsOnline
			break
		}
	}
	w.WriteHeader(http.StatusOK)
}

func enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		h.ServeHTTP(w, r)
	})
}

func main() {
	rand.Seed(time.Now().UnixNano())

	mux := http.NewServeMux()
	mux.HandleFunc("/servers", getServers)
	mux.HandleFunc("/toggle/", toggleServer)

	http.ListenAndServe(":8080", enableCORS(mux))
}
