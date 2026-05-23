/* ============================================
   PORTFOLIO EPITECH - JAVASCRIPT INTERACTIF
   ============================================ */

// ===== CONFIGURATION & CONSTANTES =====
const CONFIG = {
    scrollThreshold: 100,
    animationOffset: 0.15,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// ===== DOM ELEMENTS =====
const DOM = {
    header: document.querySelector('.header'),
    burger: null, // Sera créé dynamiquement
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

// ===== INITIALISATION AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    initScrollHeaderHide();
    console.log('✅ Portfolio initialisé avec succès !');
});

// ===== MENU BURGER (MOBILE) =====
function initBurgerMenu() {
    // Créer le bouton burger
    const burger = document.createElement('button');
    burger.className = 'header__burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    
    // Créer les 3 lignes du burger
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'header__burger-line';
        burger.appendChild(line);
    }
    
    // Insérer le burger dans le header
    const nav = document.querySelector('.header__nav');
    const logo = document.querySelector('.header__logo');
    nav.insertBefore(burger, DOM.menu);
    DOM.burger = burger;
    
    // Gérer le clic sur le burger
    burger.addEventListener('click', toggleMenu);
    
    // Fermer le menu au clic sur un lien
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Fermer le menu au redimensionnement
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
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

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Vérifier si c'est un lien interne (commence par #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = DOM.header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus pour l'accessibilité
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            }
        });
    });
}

// ===== ANIMATIONS AU SCROLL (INTERSECTION OBSERVER) =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.animationOffset,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optionnel : ne plus observer après l'animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les cartes de projets
    DOM.projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observer les items d'expérience
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        observer.observe(item);
    });
}

// ===== CACHER/MONTRER HEADER AU SCROLL =====
function initScrollHeaderHide() {
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= CONFIG.scrollThreshold) {
            DOM.header.classList.remove('header--hidden');
        } else if (currentScroll > lastScroll && currentScroll > CONFIG.scrollThreshold) {
            DOM.header.classList.add('header--hidden');
            closeMenu(); // Fermer le menu si ouvert
        } else if (currentScroll < lastScroll) {
            DOM.header.classList.remove('header--hidden');
        }
        
        lastScroll = currentScroll;
    }
}

function initFormValidation() {
    if (!DOM.contactForm) return;
    
    Object.values(DOM.formInputs).forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('contact-form__input--error')) {
                    validateField(input);
                }
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
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
            }
            break;
        case 'email':
            if (!CONFIG.emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Le message doit contenir au moins 10 caractères';
            }
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
        if (firstInvalid) {
            firstInvalid.focus();
        }
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
            if (input) {
                input.classList.remove('contact-form__input--error');
            }
        });
    }, 1500);
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'contact-form__success';
    successMessage.style.cssText = `
        background: #48bb78;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 600;
        animation: fadeInUp 0.5s ease-out;
    `;
    successMessage.textContent = '✅ Message envoyé avec succès ! (Simulation)';
    
    DOM.contactForm.insertAdjacentElement('beforebegin', successMessage);
    
    setTimeout(() => {
        successMessage.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => successMessage.remove(), 500);
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const DEBUG = false;
function log(...args) {
    if (DEBUG) {
        console.log('[Portfolio]', ...args);
    }
}