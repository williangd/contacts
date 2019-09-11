package main

import (
	"log"
	"net/http"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
	"github.com/lpar/gzipped"
	"github.com/williangd/contacts/api"
)

func start() {
	r := mux.NewRouter()

	initAPI(r)
	initStatic(r)

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server running http://localhost" + srv.Addr)
	log.Fatal(srv.ListenAndServe())
}

func initAPI(r *mux.Router) {
	ar := r.PathPrefix("/api").Subrouter()
	ar.Use(gziphandler.GzipHandler)

	ar.HandleFunc("/contacts", api.List).Methods("GET")
	ar.HandleFunc("/contact", api.Add).Methods("POST")
	ar.HandleFunc("/contact/{id}", api.Delete).Methods("DELETE")
	ar.HandleFunc("/contact", api.Update).Methods("PUT")
}

func initStatic(r *mux.Router) {
	fs := gzipped.FileServer(http.Dir("static"))
	r.PathPrefix("/").Handler(indexHandler(fs))
}

func indexHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			r.URL.Path = "/index.html"
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	start()
}
