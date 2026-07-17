package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", env("DATABASE_URL", "postgres://127.0.0.1:5433/postgres?sslmode=disable"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS notes (
		id serial PRIMARY KEY,
		who text NOT NULL,
		body text NOT NULL
	)`)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if _, err := db.Exec(`INSERT INTO notes (who, body) VALUES ('go', 'hello from go')`); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		var n int
		_ = db.QueryRow(`SELECT count(*) FROM notes`).Scan(&n)
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"service": "go", "notes": n})
	})

	log.Fatal(http.ListenAndServe(":"+env("GO_PORT", "8081"), nil))
}

func env(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
