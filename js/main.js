const CONFIG = {
    scrollThreshold: 100,
    animationOffset: 0.15,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

const DOM = {
    header: document.querySelector('.header'),
    burger: null,
    menu: document.querySelector('.header__menu'),
    navLinks: document.querySelectorAll('.header__link'),
    projectCards: document.querySelectorAll('.project-card'),
    contactForm: document.querySelector('.contact-form'),
    formInputs: {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message')
    },
    submitButton: document.querySelector('.btn--submit')
};

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    initScrollHeaderHide();
    initSkillBars();
    console.log('✅ Portfolio initialisé avec succès !');
});

function initBurgerMenu() {
    const burger = document.createElement('button');
    burger.className = 'header__burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'header__burger-line';
        burger.appendChild(line);
    }
    const nav = document.querySelector('.header__nav');
    nav.insertBefore(burger, DOM.menu);
    DOM.burger = burger;
    burger.addEventListener('click', toggleMenu);
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMenu();
        }, 250);
    });
}

function toggleMenu() {
    const isOpen = DOM.menu.classList.toggle('header__menu--open');
    DOM.burger.classList.toggle('header__burger--active', isOpen);
    DOM.burger.setAttribute('aria-expanded', isOpen);
    DOM.burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
}

function closeMenu() {
    DOM.menu.classList.remove('header__menu--open');
    DOM.burger.classList.remove('header__burger--active');
    DOM.burger.setAttribute('aria-expanded', 'false');
    DOM.burger.setAttribute('aria-label', 'Ouvrir le menu');
}

function initSmoothScroll() {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    const headerHeight = DOM.header.offsetHeight;
                    window.scrollTo({ top: targetElement.offsetTop - headerHeight, behavior: 'smooth' });
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: CONFIG.animationOffset, rootMargin: '0px 0px -50px 0px' });

    DOM.projectCards.forEach(card => observer.observe(card));
    document.querySelectorAll('.experience-item').forEach(item => observer.observe(item));
}

function initScrollHeaderHide() {
    let lastScroll = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll <= CONFIG.scrollThreshold) {
                    DOM.header.classList.remove('header--hidden');
                } else if (currentScroll > lastScroll) {
                    DOM.header.classList.add('header--hidden');
                    closeMenu();
                } else {
                    DOM.header.classList.remove('header--hidden');
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initFormValidation() {
    if (!DOM.contactForm) return;
    Object.values(DOM.formInputs).forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('contact-form__input--error')) validateField(input);
            });
        }
    });
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    let errorElement = field.parentElement.querySelector('.contact-form__error');
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'contact-form__error';
        field.parentElement.appendChild(errorElement);
    }
    switch(field.id) {
        case 'name':
            if (value.length < 2) { isValid = false; errorMessage = 'Le nom doit contenir au moins 2 caractères'; }
            break;
        case 'email':
            if (!CONFIG.emailRegex.test(value)) { isValid = false; errorMessage = 'Veuillez entrer une adresse email valide'; }
            break;
        case 'message':
            if (value.length < 10) { isValid = false; errorMessage = 'Le message doit contenir au moins 10 caractères'; }
            break;
    }
    if (isValid) {
        field.classList.remove('contact-form__input--error');
        errorElement.classList.remove('contact-form__error--visible');
    } else {
        field.classList.add('contact-form__input--error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('contact-form__error--visible');
    }
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const isNameValid = validateField(DOM.formInputs.name);
    const isEmailValid = validateField(DOM.formInputs.email);
    const isMessageValid = validateField(DOM.formInputs.message);
    if (isNameValid && isEmailValid && isMessageValid) {
        simulateFormSubmission();
    } else {
        const firstInvalid = DOM.contactForm.querySelector('.contact-form__input--error');
        if (firstInvalid) firstInvalid.focus();
    }
}

function simulateFormSubmission() {
    const button = DOM.submitButton;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Envoi en cours...';
    setTimeout(() => {
        showFormSuccess();
        DOM.contactForm.reset();
        button.disabled = false;
        button.textContent = originalText;
        Object.values(DOM.formInputs).forEach(input => {
            if (input) input.classList.remove('contact-form__input--error');
        });
    }, 1500);
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.style.cssText = 'background:#48bb78;color:white;padding:1rem;border-radius:8px;margin-bottom:1rem;text-align:center;font-weight:600;';
    successMessage.textContent = '✅ Message envoyé avec succès ! (Simulation)';
    DOM.contactForm.insertAdjacentElement('beforebegin', successMessage);
    setTimeout(() => successMessage.remove(), 5000);
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar__fill');

    // Appliquer la classe de couleur selon le niveau
    skillBars.forEach(bar => {
        const width = parseInt(bar.getAttribute('data-width'));
        if (width >= 75) {
            bar.classList.add('skill-bar__fill--high');
        } else if (width >= 55) {
            bar.classList.add('skill-bar__fill--mid');
        } else {
            bar.classList.add('skill-bar__fill--low');
        }
    });

    // Observer pour déclencher l'animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                const index = [...skillBars].indexOf(bar);
                const delay = (index % 6) * 100;
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                    setTimeout(() => bar.classList.add('is-animated'), 1300);
                }, delay);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => observer.observe(bar));
}

const DEBUG = false;
function log(...args) {
    if (DEBUG) console.log('[Portfolio]', ...args);
}