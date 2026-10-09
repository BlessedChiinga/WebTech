
"use strict";

/* ==========================================
   1. CONTACT FORM — VALIDATION & LIVE FEEDBACK
   ========================================== */

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");

const formFeedback = document.getElementById("form-feedback");
const messagePreview = document.getElementById("message-preview");

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.toggle("input-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateField(input) {
    const value = input.value.trim();

    if (input === nameInput) {
        showFieldError(
            input,
            nameError,
            value.length < 2 ? "Enter at least 2 characters." : ""
        );
    }

    if (input === emailInput) {
        showFieldError(
            input,
            emailError,
            !value
                ? "Your email address is required."
                : !isValidEmail(value)
                    ? "Enter a valid email address."
                    : ""
        );
    }

    if (input === messageInput) {
        showFieldError(
            input,
            messageError,
            value.length < 10
                ? "Your message must contain at least 10 characters."
                : ""
        );
    }
}

if (contactForm) {
    [nameInput, emailInput, messageInput].forEach(function (input) {
        if (!input) return;

        input.addEventListener("blur", function () {
            validateField(input);
        });

        input.addEventListener("input", function () {
            if (input.classList.contains("input-error")) {
                validateField(input);
            }

            if (formFeedback) {
                formFeedback.textContent = "";
                formFeedback.classList.remove("success-message");
            }

            if (messagePreview) {
                messagePreview.hidden = true;
            }
        });
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!nameInput || !emailInput || !messageInput) return;

        [nameInput, emailInput, messageInput].forEach(validateField);

        const firstInvalidField = [nameInput, emailInput, messageInput]
            .find(function (input) {
                return input.getAttribute("aria-invalid") === "true";
            });

        if (firstInvalidField) {
            formFeedback.textContent =
                "Please check the highlighted fields and try again.";

            firstInvalidField.focus();
            return;
        }

        document.getElementById("preview-name").textContent =
            nameInput.value.trim();

        document.getElementById("preview-email").textContent =
            emailInput.value.trim();

        document.getElementById("preview-message").textContent =
            messageInput.value.trim();

        if (messagePreview) {
            messagePreview.hidden = false;
            messagePreview.classList.remove("reveal");
            void messagePreview.offsetWidth;
            messagePreview.classList.add("reveal");
        }

        formFeedback.textContent =
            "Everything looks good! Review your message below.";

        formFeedback.classList.add("success-message");
    });
}


/* ==========================================
   2. PROJECT CARDS — EXPANDABLE DETAILS
   ========================================== */

const projectButtons = document.querySelectorAll(".project-button");

projectButtons.forEach(function (button) {
    const detailsId = button.getAttribute("aria-controls");
    const details = detailsId
        ? document.getElementById(detailsId)
        : null;

    if (!details) return;

    button.setAttribute("aria-expanded", String(!details.hidden));
    button.textContent = details.hidden ? "View Project ↓" : "Hide Details ↑";

    button.addEventListener("click", function () {
        const opening = details.hidden;

        details.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.textContent = opening ? "Hide Details ↑" : "View Project ↓";

        if (opening) {
            details.classList.remove("reveal");
            void details.offsetWidth;
            details.classList.add("reveal");
        }
    });
});


/* ==========================================
   3. PHOTO GALLERY — NAVIGATION & KEYBOARD
   ========================================== */

const photos = [
    {
        src: "images/photo1.jpg",
        alt: "First gallery photograph",
        caption: "My first photograph"
    },
    {
        src: "images/photo2.jpg",
        alt: "Second gallery photograph",
        caption: "My second photograph"
    },
    {
        src: "images/photo3.jpg",
        alt: "Third gallery photograph",
        caption: "My third photograph"
    }
];

let currentPhoto = 0;

const galleryImage = document.getElementById("gallery-image");
const galleryCaption = document.getElementById("gallery-caption");
const galleryCounter = document.getElementById("gallery-counter");

const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

function showPhoto(index) {
    if (
        !galleryImage ||
        !galleryCaption ||
        !galleryCounter ||
        !previousButton ||
        !nextButton ||
        index < 0 ||
        index >= photos.length
    ) {
        return;
    }

    currentPhoto = index;
    const photo = photos[currentPhoto];

    galleryImage.classList.add("photo-changing");

    galleryImage.onload = function () {
        galleryImage.classList.remove("photo-changing");
    };

    galleryImage.onerror = function () {
        galleryImage.classList.remove("photo-changing");
        galleryCaption.textContent =
            photo.caption + " — image could not be loaded.";
    };

    galleryImage.src = photo.src;
    galleryImage.alt = photo.alt;

    galleryCaption.textContent = photo.caption;
    galleryCounter.textContent =
        `Photo ${currentPhoto + 1} of ${photos.length}`;

    previousButton.disabled = currentPhoto === 0;
    nextButton.disabled = currentPhoto === photos.length - 1;
}

if (previousButton) {
    previousButton.addEventListener("click", function () {
        showPhoto(currentPhoto - 1);
    });
}

if (nextButton) {
    nextButton.addEventListener("click", function () {
        showPhoto(currentPhoto + 1);
    });
}

// Allow left and right arrow keys to navigate the gallery.
document.addEventListener("keydown", function (event) {
    const tag = document.activeElement?.tagName;

    if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) {
        return;
    }

    if (event.key === "ArrowLeft" && previousButton &&
        !previousButton.disabled) {
        showPhoto(currentPhoto - 1);
    }

    if (event.key === "ArrowRight" && nextButton &&
        !nextButton.disabled) {
        showPhoto(currentPhoto + 1);
    }
});

showPhoto(0);


/* ==========================================
   4. LIGHT & DARK MODE — REMEMBER PREFERENCE
   ========================================== */

const themeButton = document.getElementById("theme-button");

function updateThemeButton(isDark) {
    if (!themeButton) return;

    themeButton.textContent = isDark
        ? "☀ Light Mode"
        : "☾ Dark Mode";

    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

function applyTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);

    updateThemeButton(isDark);
}

let savedTheme = null;

try {
    savedTheme = localStorage.getItem("website-theme");
} catch (error) {
    // The website still works if browser storage is unavailable.
}

const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(
    savedTheme === "dark"
        ? true
        : savedTheme === "light"
            ? false
            : prefersDark
);

if (themeButton) {
    themeButton.addEventListener("click", function () {
        const isDark = !document.body.classList.contains("dark-theme");

        applyTheme(isDark);

        try {
            localStorage.setItem(
                "website-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            // Theme switching still works for the current page.
        }
    });
}


/* ==========================================
   5. SMOOTH NAVIGATION & ACTIVE LINKS
   ========================================== */

const navigationLinks = document.querySelectorAll('nav a[href^="#"]');

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");
        const target = targetId
            ? document.querySelector(targetId)
            : null;

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });

        if (targetId) {
            history.replaceState(null, "", targetId);
        }
    });
});


/* ==========================================
   6. BACK TO TOP BUTTON
   ========================================== */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
    function updateBackToTop() {
        backToTop.classList.toggle(
            "visible",
            window.scrollY > 350
        );
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });
}


/* ==========================================
   7. FOOTER — AUTOMATIC CURRENT YEAR
   ========================================== */

const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
