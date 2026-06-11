'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSubtitle = document.querySelector("[data-modal-subtitle]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    if (modalSubtitle) {
      const subtitleEl = this.querySelector("[data-testimonials-subtitle]");
      modalSubtitle.innerHTML = subtitleEl ? subtitleEl.innerHTML : "";
      modalSubtitle.style.display = subtitleEl ? "" : "none";
    }
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) { select.addEventListener("click", function () { elementToggleFunc(this); }); }

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function navigateToPage(pageName) {
  for (let i = 0; i < pages.length; i++) {
    if (pageName === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, 0);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerHTML.toLowerCase();
    if (pageName === "resume") {
      showResumeGate();
    } else {
      navigateToPage(pageName);
    }
  });
}



// resume email gate
const resumeGateOverlay = document.getElementById("resumeGateOverlay");
const resumeGateForm = document.getElementById("resumeGateForm");
const resumeGateClose = document.getElementById("resumeGateClose");
const resumeGateName = document.getElementById("resumeGateName");
const resumeGateEmail = document.getElementById("resumeGateEmail");
const resumeGateError = document.getElementById("resumeGateError");

function showResumeGate() {
  resumeGateName.value = "";
  resumeGateEmail.value = "";
  resumeGateError.textContent = "";
  resumeGateOverlay.classList.add("active");
  setTimeout(() => resumeGateName.focus(), 100);
}

function hideResumeGate() {
  resumeGateOverlay.classList.remove("active");
}

resumeGateClose.addEventListener("click", hideResumeGate);

resumeGateOverlay.addEventListener("click", function (e) {
  if (e.target === resumeGateOverlay) hideResumeGate();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && resumeGateOverlay.classList.contains("active")) {
    hideResumeGate();
  }
});

resumeGateForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = resumeGateName.value.trim();
  const email = resumeGateEmail.value.trim();

  if (!name) {
    resumeGateError.textContent = "Please enter your name.";
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    resumeGateError.textContent = "Please enter a valid email address.";
    return;
  }

  resumeGateError.textContent = "";

  try {
    await fetch("https://formspree.io/f/mykdvjaq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: "Resume Viewed by " + name + " (" + email + ")"
      })
    });
  } catch (_) { /* fail silently, still show resume */ }

  hideResumeGate();
  navigateToPage("resume");
});