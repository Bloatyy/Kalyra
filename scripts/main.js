// Component Loading System
const components = {
    navbar: 'components/navbar.html',
    footer: 'components/footer.html',
    marquee: 'components/marquee.html',
    hero: 'sections/hero.html',
    about: 'sections/about.html',
    shop: 'sections/products.html',
    faq: 'sections/faq.html',
    cta: 'sections/cta.html'
};

async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return false;

    try {
        // Add cache-busting timestamp to prevent aggressive default caching
        const cacheBuster = `?t=${new Date().getTime()}`;
        const response = await fetch(filePath + cacheBuster);
        const html = await response.text();
        element.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return false;
    }
}

async function loadAllComponents() {
    const loadPromises = Object.keys(components).map(id => loadComponent(id, components[id]));
    await Promise.all(loadPromises);

    if (document.getElementById('gallery-strip')) {
        await loadGalleryStrip();
    }

    // Inject mobile drawer at body level (outside nav stacking context)
    const drawersHTML = `
        <div class="nav-drawer" id="nav-drawer">
            <div class="drawer-header">
                <div class="drawer-logo">KALYRA</div>
                <div class="drawer-close" id="drawer-close">&times;</div>
            </div>
            <div class="drawer-content">
                <ul class="drawer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="shop.html">Shop</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="#login" class="nav-cta">Login</a></li>
                </ul>
                <div class="drawer-footer"><p>ELEVATE YOUR LIFESTYLE</p></div>
            </div>
        </div>
        <div class="nav-overlay" id="nav-overlay"></div>`;
    document.body.insertAdjacentHTML('beforeend', drawersHTML);

    // Load and inject modals
    try {
        const [loginRes, signupRes] = await Promise.all([
            fetch('components/login-modal.html'),
            fetch('components/signup-modal.html')
        ]);
        const [loginHTML, signupHTML] = await Promise.all([
            loginRes.text(),
            signupRes.text()
        ]);
        document.body.insertAdjacentHTML('beforeend', loginHTML);
        document.body.insertAdjacentHTML('beforeend', signupHTML);
    } catch (e) {
        console.error('Could not load modals:', e);
    }

    // Initialize all functionality after components are loaded
    initNavbarScroll();
    initScrollReveal();
    initFaqAccordion();
    initMobileMenu();
    initMobileSearch();
    initModals();
}

function initMobileSearch() {
    const trigger = document.getElementById('mobile-search-trigger');
    const dropdown = document.getElementById('mobile-search-dropdown');
    const closeBtn = document.getElementById('mobile-search-close');
    const input = document.getElementById('mobile-search-input');

    if (!trigger || !dropdown || !closeBtn) return;

    trigger.addEventListener('click', () => {
        dropdown.classList.add('active');
        input?.focus();
    });

    closeBtn.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dropdown.classList.remove('active');
    });
}

async function loadGalleryStrip() {
    const galleryImages = [
        'assets/floral-gem-art.jpg',
        'assets/anklet-embroidery-tote.jpg',
        'assets/mirror-butterfly-art.jpg',
        'assets/mandala-art-sketchbook.jpg',
        'assets/floral-resin-coasters.jpg',
        'assets/flower-shaped-resin-coasters.jpg',
        'assets/black-resin-name-plate.jpg',
        'assets/doctor-resin-name-plate.jpg',
        'assets/ceo-resin-name-plate.jpg',
        'assets/wedding-resin-plate.jpg'
    ];

    // Double the images for seamless loop
    const itemsHTML = [...galleryImages, ...galleryImages].map(src => `
        <div class="gallery-item">
            <img src="${src}" alt="Kalyra Art">
        </div>
    `).join('');

    const galleryHTML = `
        <div class="gallery-strip">
            <div class="section-header reveal" style="margin-bottom: 40px;">
                <div>
                    <div class="section-label">Indo-Western Art</div>
                    <h2 class="section-title">Collector <em>Reviews</em></h2>
                </div>
            </div>
            <div class="gallery-track">
                ${itemsHTML}
            </div>
        </div>
    `;
    document.getElementById('gallery-strip').innerHTML = galleryHTML;
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }
}

function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.style.transitionDelay = `${i * 0.05}s`;
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
}

function initFaqAccordion() {
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-overlay');
    const closeBtn = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-links a');

    if (!toggle || !drawer || !overlay) return;

    const toggleMenu = () => {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initModals() {
    const loginModal = document.getElementById('login-modal');
    const loginBackdrop = document.getElementById('login-backdrop');
    const signupModal = document.getElementById('signup-modal');
    const signupBackdrop = document.getElementById('signup-backdrop');

    const toSignup = document.getElementById('to-signup');
    const toLogin = document.getElementById('to-login');

    const openLogin = (e) => {
        if (e) e.preventDefault();
        closeAllModals();
        loginModal?.classList.add('active');
        loginBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const openSignup = (e) => {
        if (e) e.preventDefault();
        closeAllModals();
        signupModal?.classList.add('active');
        signupBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllModals = () => {
        [loginModal, loginBackdrop, signupModal, signupBackdrop].forEach(el => el?.classList.remove('active'));
        document.body.style.overflow = '';
    };

    // Global triggers
    document.querySelectorAll('a[href="#login"]').forEach(a => a.addEventListener('click', openLogin));
    document.querySelectorAll('a[href="#signup"]').forEach(a => a.addEventListener('click', openSignup));

    // Internal switches
    toSignup?.addEventListener('click', openSignup);
    toLogin?.addEventListener('click', openLogin);

    // Close buttons
    [document.getElementById('login-close'), document.getElementById('signup-close')].forEach(b => b?.addEventListener('click', closeAllModals));

    // Backdrop clicks
    [loginBackdrop, signupBackdrop].forEach(b => b?.addEventListener('click', closeAllModals));

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Toggle PW
    ['login', 'signup'].forEach(type => {
        const btn = document.getElementById(`${type}-toggle-pw`);
        const input = document.getElementById(`${type}-password`);
        btn?.addEventListener('click', () => {
            if (input) input.type = input.type === 'password' ? 'text' : 'password';
        });
    });
}

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', loadAllComponents);