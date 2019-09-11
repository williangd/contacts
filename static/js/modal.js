(function() {
  'use strict';

  const modal = document.querySelector('.modal');
  const closeButton = document.querySelector('[data-js="close"]');

  function toggleModal() {
    modal.classList.toggle('show-modal');
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }

  closeButton.addEventListener('click', toggleModal);
  window.addEventListener('click', windowOnClick);

  function init() {
    return {
      toggle: toggleModal,
    };
  }

  window.modal = init();
})();
