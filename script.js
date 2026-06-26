const accordionItems = [...document.querySelectorAll("details.info-column")];
const mobileQuery = window.matchMedia("(max-width: 600px)");
const contactForm = document.querySelector(".contact-form");
const endpointPlaceholder = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const thankYouPage = "thank-you.html";

function setMobileAccordionState() {
  if (!mobileQuery.matches) {
    accordionItems.forEach((item) => {
      item.open = true;
    });
    return;
  }

  const openItems = accordionItems.filter((item) => item.open);
  if (openItems.length === 0) accordionItems[0].open = true;

  openItems.slice(1).forEach((item) => {
    item.open = false;
  });
}

accordionItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!mobileQuery.matches || !item.open) return;

    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

mobileQuery.addEventListener("change", setMobileAccordionState);
setMobileAccordionState();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function setFormStatus(form, message, type = "") {
  const status = form.querySelector(".form-status");
  if (!status) return;

  status.textContent = message;
  status.dataset.status = type;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.dataset.formEndpoint;
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setFormStatus(contactForm, "Please complete your name, email, and message.", "error");
      return;
    }

    if (!isValidEmail(payload.email)) {
      setFormStatus(contactForm, "Please enter a valid email address.", "error");
      return;
    }

    if (!endpoint || endpoint === endpointPlaceholder) {
      setFormStatus(
        contactForm,
        "Form is ready. Add the Google Apps Script Web App URL to connect submissions.",
        "error"
      );
      return;
    }

    try {
      submitButton.disabled = true;
      setFormStatus(contactForm, "Sending…");

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      contactForm.reset();
      window.location.href = thankYouPage;
    } catch (error) {
      setFormStatus(
        contactForm,
        "Something went wrong. Please try again in a moment.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });
}
