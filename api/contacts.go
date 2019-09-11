package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/xid"
)

// Contact define contact
type Contact struct {
	Name  string `json:"name"`
	Mail  string `json:"mail"`
	Phone string `json:"phone"`
	ID    xid.ID `json:"id"`
}

var contactList = []Contact{
	Contact{Name: "Willian", Mail: "willian@mail.com", Phone: "(48) 99987-1234", ID: xid.New()},
	Contact{Name: "Gabriel", Mail: "gabriel@mail.com", Phone: "(48) 99988-9876", ID: xid.New()},
	Contact{Name: "Adriana", Mail: "adriana@hotmail.com", Phone: "(41) 99965-6598", ID: xid.New()},
}

// List contacts
func List(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(contactList)
}

// Add contact
func Add(w http.ResponseWriter, r *http.Request) {
	var contact Contact

	err := json.NewDecoder(r.Body).Decode(&contact)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	contact.ID = xid.New()

	contactList = append(contactList, contact)

	json.NewEncoder(w).Encode(contactList)
}

// Delete contact
func Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	contactList = filterContacts(vars["id"])

	json.NewEncoder(w).Encode(contactList)
}

func filterContacts(id string) []Contact {
	newList := []Contact{}

	for _, v := range contactList {
		if v.ID.String() == id {
			continue
		}
		newList = append(newList, v)
	}

	return newList
}

// Update contact
func Update(w http.ResponseWriter, r *http.Request) {
	var contact Contact

	err := json.NewDecoder(r.Body).Decode(&contact)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	updateContact(contact)

	json.NewEncoder(w).Encode(contactList)
}

func updateContact(contact Contact) {
	for i := range contactList {
		if contactList[i].ID == contact.ID {
			contactList[i].Name = contact.Name
			contactList[i].Mail = contact.Mail
			contactList[i].Phone = contact.Phone
		}
	}
}
