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

    // Skip loading if already has substantial inlined content
    if (element.children.length > 0 || element.innerText.trim().length > 100) {
        return true;
    }

    try {
        // Cache-busting only for web protocols (http/https) to prevent failures on file://
        const isWeb = window.location.protocol.startsWith('http');
        const cacheBuster = isWeb ? `?t=${new Date().getTime()}` : '';

        const response = await fetch(filePath + cacheBuster);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        element.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return false;
    }
}

async function loadAllComponents() {
    // Robust check for shop page
    const isShopPage = window.location.pathname.endsWith('shop.html') || window.location.pathname.endsWith('shop') || window.location.pathname.includes('/shop/');

    console.log('Initial Shop Page Check:', { pathname: window.location.pathname, isShopPage });

    const loadPromises = Object.keys(components).map(id => {
        let path = components[id];
        if (id === 'shop' && isShopPage) {
            path = 'sections/shop-content.html';
        }
        return loadComponent(id, path);
    });

    await Promise.all(loadPromises);

    // Recalculate isShopPage after components are loaded into the DOM
    const shopGridExists = !!document.getElementById('shop-products-grid');
    const finalIsShopPage = window.location.pathname.includes('shop.html') || shopGridExists;

    console.log('Final Shop Page Check:', { finalIsShopPage, shopGridExists });

    if (document.getElementById('gallery-strip')) {
        await loadGalleryStrip();
    }

    // Inject mobile drawer at body level
    if (!document.getElementById('nav-drawer')) {
        const drawersHTML = `
            <div class="nav-drawer" id="nav-drawer">
                <div class="drawer-header">
                    <div class="drawer-logo">KALYRA</div>
                    <div class="drawer-close" id="drawer-close">&times;</div>
                </div>
                <div class="drawer-content">
                    <ul class="drawer-links">
                        <li><a href="index.html">Home</a></li>
                        <li class="has-dropdown">
                            <div class="drawer-link-row">
                                <a href="shop.html">Shop</a>
                                <button class="drawer-dropdown-toggle">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>
                            <ul class="drawer-submenu">
                                <li><a href="shop.html?category=bespoke">Bespoke Collection</a></li>
                                <li><a href="shop.html?category=artistry">Artistry Collection</a></li>
                                <li><a href="shop.html?category=living">Living Collection</a></li>
                                <li><a href="shop.html?category=wearable">Wearable Collection</a></li>
                            </ul>
                        </li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="drawer-footer"><p>ELEVATE YOUR LIFESTYLE</p></div>
            </div>
            <div class="nav-overlay" id="nav-overlay"></div>`;
        document.body.insertAdjacentHTML('beforeend', drawersHTML);
    }

    // Load and inject unified login modal
    if (!document.getElementById('login-modal')) {
        try {
            const loginRes = await fetch('components/login-modal.html');
            const loginHTML = await loginRes.text();
            document.body.insertAdjacentHTML('beforeend', loginHTML);
        } catch (e) {
            console.error('Could not load modal:', e);
        }
    }

    // Initialize all functionality
    initNavbarScroll();
    initScrollReveal();
    initFaqAccordion();
    initMobileMenu();
    initMobileSearch();
    initGlobalSearch();
    initModals();

    if (finalIsShopPage) {
        console.log('Detected Shop Page, initializing filters...');
        // Use a more robust check for DOM readiness
        const waitForGrid = (retries = 0) => {
            const grid = document.getElementById('shop-products-grid') || document.querySelector('.products-grid');
            if (grid) {
                initShopFilters();
            } else if (retries < 10) {
                console.log(`Waiting for grid... retry ${retries + 1}`);
                setTimeout(() => waitForGrid(retries + 1), 100);
            } else {
                console.error('Timed out waiting for Shop Products Grid.');
            }
        };
        waitForGrid();
    }
}

function initShopFilters() {
    console.log('Initializing Shop Filters...');
    const products = [
        { name: "Boho Embroidery Tote", img: "assets/anklet-embroidery-tote.jpg", category: "wearable", style: "Love & Aesthetic" },
        { name: "Midnight Resin Nameplate", img: "assets/black-resin-name-plate.jpg", category: "bespoke", style: "Bold & Expressive" },
        { name: "Executive CEO Nameplate", img: "assets/ceo-resin-name-plate.jpg", category: "bespoke", style: "Professional" },
        { name: "Medical Professional Nameplate", img: "assets/doctor-resin-name-plate.jpg", category: "bespoke", style: "Professional" },
        { name: "Floral Gem Mosaic", img: "assets/floral-gem-art.jpg", category: "artistry", style: "Bold & Expressive" },
        { name: "Spring Blossom Coasters", img: "assets/floral-resin-coasters.jpg", category: "living", style: "Calm & Minimal" },
        { name: "Botanical Petal Coasters", img: "assets/flower-shaped-resin-coasters.jpg", category: "living", style: "Love & Aesthetic" },
        { name: "Divine Harmony Mandala", img: "assets/mandala-art-sketchbook.jpg", category: "mandala", style: "Spiritual Mandala" },
        { name: "Ethereal Butterfly Mirror Art", img: "assets/mirror-butterfly-art.jpg", category: "mandala", style: "Spiritual Mandala" },
        { name: "Majestic Horse Portrait", img: "assets/mirror-horse-portrait.jpg", category: "artistry", style: "Bold & Expressive" },
        { name: "Azure Ocean Keychain", img: "assets/ocean-keychain-sakshi.jpg", category: "bespoke", style: "Love & Aesthetic" },
        { name: "Lady in Pearls Portrait", img: "assets/pearl-hat-portrait.jpg", category: "artistry", style: "Love & Aesthetic" },
        { name: "Golden Shore Resin Coasters", img: "assets/resin-coasters-gold.jpg", category: "living", style: "Calm & Minimal" },
        { name: "Elegant Family Nameplate", img: "assets/resin-name-plate-shah.jpg", category: "bespoke", style: "Bold & Expressive" },
        { name: "Sun-Kissed Sunflower Tote", img: "assets/sunflower-tote.jpg", category: "wearable", style: "Love & Aesthetic" },
        { name: "Eternal Vows Wedding Plate", img: "assets/wedding-resin-plate.jpg", category: "bespoke", style: "Spiritual Mandala" }
    ];

    let cardsContainer = document.getElementById('shop-products-grid') || document.querySelector('.products-grid');

    // Fallback/Retry logic for slow DOM injection
    if (!cardsContainer) {
        console.warn('Shop grid not found immediately, retrying...');
        // We'll proceed if possible, but the caller (setTimeout) handles the main wait
    }

    if (!cardsContainer) {
        console.error('Shop Products Grid container not found in DOM.');
        return;
    }

    // 1. Render all products with random prices
    console.log(`Rendering ${products.length} products...`);
    cardsContainer.innerHTML = '';
    const renderedCards = products.map((p, index) => {
        const price = Math.floor(Math.random() * (4500 - 499) + 499);
        const imgSrc = p.img;
        const card = document.createElement('div');
        // Do NOT use 'reveal' class — IntersectionObserver is async and misses
        // elements already in the viewport, leaving them stuck at opacity:0.
        // Instead, use a direct staggered CSS animation.
        card.className = 'product-card shop-card-animate';
        card.style.animationDelay = `${index * 0.05}s`;
        card.dataset.category = p.category;
        card.dataset.price = price;
        card.dataset.style = p.style;

        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/400x500/F5F0E8/8C7E72?text=Coming+Soon';">
                <div class="product-add">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
            </div>
            <div class="product-brand">${p.category.charAt(0).toUpperCase() + p.category.slice(1)} Collection</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">₹${price.toLocaleString()}</p>
        `;
        cardsContainer.appendChild(card);
        return card;
    });

    console.log('Products rendered successfully.');

    const filters = {
        categories: [],
        maxPrice: Number.MAX_VALUE,
        style: null,
        sortBy: 'featured',
        searchTerm: ''
    };

    const drawer = document.getElementById('filter-drawer');
    const overlay = document.getElementById('filter-overlay');
    const toggleBtn = document.getElementById('filter-toggle');
    const closeBtn = document.getElementById('filter-close');
    const applyBtn = document.getElementById('apply-filters');
    const sortDropdown = document.getElementById('sort-dropdown');

    const toggleDrawer = () => {
        drawer?.classList.toggle('active');
        overlay?.classList.toggle('active');
        document.body.style.overflow = drawer?.classList.contains('active') ? 'hidden' : '';
    };

    toggleBtn?.addEventListener('click', toggleDrawer);
    closeBtn?.addEventListener('click', toggleDrawer);
    overlay?.addEventListener('click', toggleDrawer);
    applyBtn?.addEventListener('click', toggleDrawer);

    const initialCards = renderedCards;
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    const styleTags = document.querySelectorAll('.style-tag');

    const viewBtns = document.querySelectorAll('.view-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (cardsContainer) {
                cardsContainer.className = `products-grid ${view}`;
            }
        });
    });

    const applyFiltersAndSort = () => {
        let filtered = [...initialCards];

        // 1. Filter
        filtered = filtered.filter(card => {
            const cardCategory = card.dataset.category;
            const cardPrice = parseInt(card.dataset.price);
            const cardStyle = card.dataset.style;
            const cardName = card.querySelector('.product-name').textContent.toLowerCase();

            const categoryMatch = filters.categories.length === 0 || filters.categories.includes(cardCategory);
            const priceMatch = (filters.maxPrice === 2000) ? cardPrice >= 2000 : cardPrice <= filters.maxPrice;
            const styleMatch = !filters.style || cardStyle === filters.style;
            const searchMatch = !filters.searchTerm || cardName.includes(filters.searchTerm.toLowerCase());

            return categoryMatch && priceMatch && styleMatch && searchMatch;
        });

        // 2. Sort
        if (filters.sortBy === 'price-low') filtered.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        if (filters.sortBy === 'price-high') filtered.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        if (filters.sortBy === 'alphabet-az') filtered.sort((a, b) => a.querySelector('.product-name').textContent.localeCompare(b.querySelector('.product-name').textContent));
        if (filters.sortBy === 'alphabet-za') filtered.sort((a, b) => b.querySelector('.product-name').textContent.localeCompare(a.querySelector('.product-name').textContent));

        // 3. Render
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
            if (filtered.length === 0) {
                cardsContainer.innerHTML = `
                    <div class="no-results">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <p>No treasures found matching your search. Try adjusting your filters or search term.</p>
                        <button class="btn-ghost" onclick="window.location.href='shop.html'">Clear all filters</button>
                    </div>
                `;
                cardsContainer.style.display = 'block'; // Ensure no-results is centered in grid container if it's a flex/block child
            } else {
                cardsContainer.style.display = ''; // Reset to CSS default (grid)
                filtered.forEach(card => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    cardsContainer.appendChild(card);
                });
            }
        }
    };

    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            filters.categories = Array.from(categoryCheckboxes).filter(c => c.checked).map(c => c.value);
            applyFiltersAndSort();
        });
    });

    priceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            filters.maxPrice = val === '2000+' ? 2000 : parseInt(val);
            applyFiltersAndSort();
        });
    });

    styleTags.forEach(tag => {
        tag.addEventListener('click', () => {
            styleTags.forEach(t => t.classList.remove('active'));
            if (filters.style === tag.textContent) {
                filters.style = null;
            } else {
                filters.style = tag.textContent;
                tag.classList.add('active');
            }
            applyFiltersAndSort();
        });
    });

    sortDropdown?.addEventListener('change', (e) => {
        filters.sortBy = e.target.value;
        applyFiltersAndSort();
    });

    // Initial category and search from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialCat = urlParams.get('category');
    const initialSearch = urlParams.get('q');

    if (initialCat) {
        const target = Array.from(categoryCheckboxes).find(c => c.value === initialCat);
        if (target) {
            target.checked = true;
            filters.categories = [initialCat];
        }
    }

    if (initialSearch) {
        filters.searchTerm = initialSearch;
        const desktopInput = document.getElementById('desktop-search-input');
        const mobileInput = document.getElementById('mobile-search-input');
        if (desktopInput) desktopInput.value = initialSearch;
        if (mobileInput) mobileInput.value = initialSearch;
    }

    if (initialCat || initialSearch) {
        applyFiltersAndSort();
    }
}

function initMobileSearch() {
    const trigger = document.getElementById('mobile-search-trigger');
    const dropdown = document.getElementById('mobile-search-dropdown');
    const input = document.getElementById('mobile-search-input');

    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.add('active');
        input?.focus();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
            dropdown.classList.remove('active');
        }
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

    // Mobile Drawer Dropdown Toggle
    const dropdownToggle = document.querySelector('.drawer-dropdown-toggle');
    const submenu = document.querySelector('.drawer-submenu');
    
    dropdownToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownToggle.classList.toggle('active');
        submenu.classList.toggle('active');
    });
}

function initModals() {
    const loginModal = document.getElementById('login-modal');
    const loginBackdrop = document.getElementById('login-backdrop');

    const steps = {
        phone: document.getElementById('login-step-phone'),
        otp: document.getElementById('login-step-otp'),
        email: document.getElementById('login-step-email')
    };

    const showStep = (stepName) => {
        Object.values(steps).forEach(s => s ? s.hidden = true : null);
        if (steps[stepName]) steps[stepName].hidden = false;
    };

    const openLogin = (e) => {
        if (e) e.preventDefault();
        showStep('phone');
        loginModal?.classList.add('active');
        loginBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllModals = () => {
        loginModal?.classList.remove('active');
        loginBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Interaction Listeners
    document.getElementById('btn-send-otp')?.addEventListener('click', () => {
        const phone = document.getElementById('login-phone')?.value;
        if (phone?.length === 10) {
            showStep('otp');
            document.querySelector('.otp-digit')?.focus();
        } else {
            alert('Please enter a valid 10-digit number');
        }
    });

    document.getElementById('btn-to-email')?.addEventListener('click', () => {
        // Trigger Google Login
        if (typeof google !== 'undefined') {
            google.accounts.id.prompt();
        }
        showStep('email'); // Still show the step which now has the Google button
    });

    document.getElementById('btn-google-login')?.addEventListener('click', () => {
        if (typeof google !== 'undefined') {
            google.accounts.id.prompt();
        } else {
            alert('Google Sign-In is currently unavailable. Please try again later.');
        }
    });

    document.getElementById('btn-back-to-phone')?.addEventListener('click', () => showStep('phone'));
    document.getElementById('btn-back-to-phone-from-email')?.addEventListener('click', () => showStep('phone'));

    document.getElementById('btn-verify-otp')?.addEventListener('click', () => {
        alert('Verification successful! Logging you in...');
        closeAllModals();
    });

    // document.getElementById('btn-email-login')?.addEventListener('click', () => {
    //     alert('Logging in with Email & Password...');
    //     closeAllModals();
    // });

    // OTP Input Logic
    const otpDigits = document.querySelectorAll('.otp-digit');
    otpDigits.forEach((digit, idx) => {
        digit.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && idx < otpDigits.length - 1) {
                otpDigits[idx + 1].focus();
            }
        });
        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                otpDigits[idx - 1].focus();
            }
        });
    });

    // Global triggers
    document.querySelectorAll('a[href="#login"]').forEach(a => a.addEventListener('click', openLogin));
    document.querySelectorAll('a[href="#signup"]').forEach(a => a.addEventListener('click', openLogin)); // Signup also opens login

    // Close functionality
    document.getElementById('login-close')?.addEventListener('click', closeAllModals);
    loginBackdrop?.addEventListener('click', closeAllModals);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
}

// Google OAuth Response Handler
window.handleGoogleResponse = (response) => {
    try {
        // Decode the JWT token (Base64) to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);
        console.log('Google User Authenticated:', user);
        
        alert(`Welcome, ${user.name}! You have successfully logged in via Google.`);
        
        // Close modal and update UI
        const loginModal = document.getElementById('login-modal');
        const loginBackdrop = document.getElementById('login-backdrop');
        loginModal?.classList.remove('active');
        loginBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
        
        // Optional: Store user info or update navbar
        // localStorage.setItem('user', JSON.stringify(user));
        
    } catch (error) {
        console.error('Error handling Google response:', error);
        alert('An error occurred during Google Sign-In.');
    }
};

function initGlobalSearch() {
    const desktopInput = document.getElementById('desktop-search-input');
    const desktopBtn = document.getElementById('desktop-search-btn');
    const mobileInput = document.getElementById('mobile-search-input');
    const mobileBtn = document.getElementById('mobile-search-btn');

    const handleSearch = (query) => {
        if (!query.trim()) return;
        
        // Always redirect with query param for consistency
        window.location.href = `shop.html?q=${encodeURIComponent(query.trim())}`;
    };

    desktopInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(desktopInput.value);
    });

    desktopBtn?.addEventListener('click', () => {
        handleSearch(desktopInput.value);
    });

    mobileInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(mobileInput.value);
            document.getElementById('mobile-search-dropdown')?.classList.remove('active');
        }
    });

    mobileBtn?.addEventListener('click', () => {
        handleSearch(mobileInput.value);
        document.getElementById('mobile-search-dropdown')?.classList.remove('active');
    });
}

function initGoogleAuth() {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with actual Client ID
            callback: window.handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        // Optionally render the official button as well
        const googleBtnContainer = document.getElementById('btn-google-login');
        if (googleBtnContainer) {
            // Uncomment to use official Google button rendering instead of custom
            /*
            google.accounts.id.renderButton(googleBtnContainer, {
                theme: 'outline',
                size: 'large',
                width: '100%'
            });
            */
        }
    } else {
        console.warn('Google Identity Services script not loaded');
    }
}

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents().then(() => {
        initGoogleAuth();
    });
});