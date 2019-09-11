(function() {
  'use strict';

  const addButton = document.querySelector('[data-js="add"]');
  const inputName = document.querySelector('[data-js="name"]');
  const inputMail = document.querySelector('[data-js="mail"]');
  const inputPhone = document.querySelector('[data-js="phone"]');
  const button = document.querySelector('[data-js="button"]');
  let contacts = [];
  let action = 'add';
  let editID = '';

  function setAddEvent() {
    addButton.addEventListener('click', () => {
      modal.toggle();
      setFocus();
    });
  }

  function setSubmitEvent() {
    button.addEventListener('click', event => {
      event.preventDefault();
      submit();
    });
  }

  function setEvents() {
    const delButtons = document.querySelectorAll('[del-js]');
    delButtons.forEach(button => {
      button.addEventListener('click', event => {
        const id = event.target.getAttribute('del-js');
        remove(id);
      });
    });

    const editButtons = document.querySelectorAll('[edit-js]');
    editButtons.forEach(button => {
      button.addEventListener('click', event => {
        const id = event.target.getAttribute('edit-js');
        onEdit(id);
      });
    });
  }

  function submit() {
    if (action === 'add') {
      add();
      return;
    }

    edit();
  }

  function add() {
    axios
      .post('/api/contact', {
        name: inputName.value,
        mail: inputMail.value,
        phone: inputPhone.value,
      })
      .then(res => {
        fillTable(res.data);
        modal.toggle();
      })
      .catch(err => console.log(err));
  }

  function onEdit(id) {
    action = 'edit';

    const contact = contacts.find(c => c.id === id);
    inputName.value = contact.name;
    inputMail.value = contact.mail;
    inputPhone.value = contact.phone;
    editID = contact.id;
    modal.toggle();
    setFocus();
  }

  function edit() {
    axios
      .put('/api/contact', {
        name: inputName.value,
        mail: inputMail.value,
        phone: inputPhone.value,
        id: editID,
      })
      .then(res => {
        fillTable(res.data);
        modal.toggle();
      })
      .catch(err => console.log(err));
  }

  function remove(id) {
    axios
      .delete('/api/contact/' + id)
      .then(res => fillTable(res.data))
      .catch(err => console.log(err));
  }

  function fillTable(list) {
    contacts = list;

    const tbody = document.querySelector('tbody');
    const newTbody = document.createElement('tbody');

    contacts.forEach(contact => newTbody.appendChild(createRow(contact)));

    tbody.parentNode.replaceChild(newTbody, tbody);
    setEvents();
    clearForm();
  }

  function createRow(contact) {
    const tr = document.createElement('tr');
    const tdName = createTextTD(contact.name);
    const tdMail = createTextTD(contact.mail);
    const tdPhone = createTextTD(contact.phone);
    const tdButton = document.createElement('td');
    tdButton.classList.add('buttons');

    const editBtn = createButton('Edit', 'edit-js', contact.id);
    tdButton.appendChild(editBtn);

    const delBtn = createButton('Remove', 'del-js', contact.id);
    tdButton.appendChild(delBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdMail);
    tr.appendChild(tdPhone);
    tr.appendChild(tdButton);
    tr.setAttribute('id', contact.id);
    return tr;
  }

  function createTextTD(text) {
    const td = document.createElement('td');
    td.innerText = text;

    return td;
  }

  function createButton(text, attr, value) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.setAttribute(attr, value);

    return btn;
  }

  function clearForm() {
    action = 'add';
    [inputName, inputMail, inputPhone].forEach(input => (input.value = ''));
  }

  function setFocus() {
    inputName.focus();
  }

  function getContacts() {
    axios
      .get('/api/contacts')
      .then(res => fillTable(res.data))
      .catch(err => console.log(err));
  }

  function onInit() {
    setAddEvent();
    setSubmitEvent();
    getContacts();
  }

  onInit();
})();
