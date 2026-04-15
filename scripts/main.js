// Global Catalog Data
const CATALOG = [
    { id: "boho-tote", name: "Boho Embroidery Tote", img: "assets/anklet-embroidery-tote.jpg", category: "wearable", style: "Love & Aesthetic", price: 1499, description: "A beautifully handcrafted tote bag featuring intricate boho embroidery. Perfect for carrying your essentials with a touch of artistic flair." },
    { id: "midnight-nameplate", name: "Midnight Resin Nameplate", img: "assets/black-resin-name-plate.jpg", category: "bespoke", style: "Bold & Expressive", price: 2499, description: "An elegant midnight black resin nameplate with golden accents. A bold statement piece for your modern home entrance." },
    { id: "ceo-nameplate", name: "Executive CEO Nameplate", img: "assets/ceo-resin-name-plate.jpg", category: "bespoke", style: "Professional", price: 2999, description: "A premium nameplate designed for high-end professional spaces. Crafted with crystal clear resin and metallic typography." },
    { id: "doctor-nameplate", name: "Medical Professional Nameplate", img: "assets/doctor-resin-name-plate.jpg", category: "bespoke", style: "Professional", price: 2799, description: "Specifically tailored for medical professionals, blending elegance with authority. Features custom clinical iconography." },
    { id: "floral-mosaic", name: "Floral Gem Mosaic", img: "assets/floral-gem-art.jpg", category: "artistry", style: "Bold & Expressive", price: 3499, description: "A mesmerizing mosaic of floral gems preserved in high-quality resin. Each piece is a unique window into nature's beauty." },
    { id: "spring-coasters", name: "Spring Blossom Coasters", img: "assets/floral-resin-coasters.jpg", category: "living", style: "Calm & Minimal", price: 899, description: "Set of 4 coasters featuring delicate spring blossoms. Add a touch of garden freshness to your coffee table." },
    { id: "petal-coasters", name: "Botanical Petal Coasters", img: "assets/flower-shaped-resin-coasters.jpg", category: "living", style: "Love & Aesthetic", price: 999, description: "Exotic flower-shaped coasters with real pressed petals. A lovely conversation piece for any gathering." },
    { id: "divine-mandala", name: "Divine Harmony Mandala", img: "assets/mandala-art-sketchbook.jpg", category: "mandala", style: "Spiritual Mandala", price: 1999, description: "Intricately detailed mandala art that brings spiritual calm and focus to your workspace or living area." },
    { id: "butterfly-mirror", name: "Ethereal Butterfly Mirror Art", img: "assets/mirror-butterfly-art.jpg", category: "mandala", style: "Spiritual Mandala", price: 4299, description: "A stunning mirror artwork featuring ethereal butterflies in a mandala-style arrangement. Reflects light and beauty." },
    { id: "horse-portrait", name: "Majestic Horse Portrait", img: "assets/mirror-horse-portrait.jpg", category: "artistry", style: "Bold & Expressive", price: 5999, description: "A powerful horse portrait rendered on a mirrored surface with intricate detailing. A true masterpiece for collectors." },
    { id: "ocean-keychain", name: "Azure Ocean Keychain", img: "assets/ocean-keychain-sakshi.jpg", category: "bespoke", style: "Love & Aesthetic", price: 499, description: "A small piece of the ocean in your pocket. Handcrafted resin keychain with azure waves and sandy shores." },
    { id: "pearl-portrait", name: "Lady in Pearls Portrait", img: "assets/pearl-hat-portrait.jpg", category: "artistry", style: "Love & Aesthetic", price: 4899, description: "An elegant portrait of a lady adorned with real pearl accents. Blends traditional portraiture with modern resin art." },
    { id: "golden-coasters", name: "Golden Shore Resin Coasters", img: "assets/resin-coasters-gold.jpg", category: "living", style: "Calm & Minimal", price: 1299, description: "Luxury coasters inspired by golden sunlit shores. Features real gold leaf flakes suspended in premium resin." },
    { id: "shah-nameplate", name: "Elegant Family Nameplate", img: "assets/resin-name-plate-shah.jpg", category: "bespoke", style: "Bold & Expressive", price: 2699, description: "A personalized family nameplate that celebrates your home's legacy with artistic resin layers and deep colors." },
    { id: "sunflower-tote", name: "Sun-Kissed Sunflower Tote", img: "assets/sunflower-tote.jpg", category: "wearable", style: "Love & Aesthetic", price: 1399, description: "Brighten your day with this sunflower-themed tote. Durable material meets vibrant, hand-painted floral art." },
    { id: "wedding-plate", name: "Eternal Vows Wedding Plate", img: "assets/wedding-resin-plate.jpg", category: "bespoke", style: "Spiritual Mandala", price: 3899, description: "Commerative wedding plate to preserve your eternal vows. A timeless keepsake featuring personalized details." }
];

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
    initFaqAccordion();
    initMobileMenu();
    initMobileSearch();
    initGlobalSearch();
    initModals();

    if (finalIsShopPage) {
        console.log('Detected Shop Page, initializing filters...');
        // Use a more robust check for DOM readiness
        const waitForGrid = (retries = 0) => {
            const grid = document.getElementById('shop-products-grid');
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

    const isProductPage = window.location.pathname.includes('product.html') || window.location.href.includes('product.html');
    if (isProductPage) {
        console.log('Detected Product Page, initializing details...');
        await initProductPage();
    }

    // Always run scroll reveal last
    initScrollReveal();
}

function initShopFilters() {
    console.log('Initializing Shop Filters...');
    // Use the global CATALOG array instead of local products array
    const products = CATALOG;

    let cardsContainer = document.getElementById('shop-products-grid');

    // Fallback/Retry logic for slow DOM injection
    if (!cardsContainer) {
        console.warn('Shop grid not foundn immediately, retrying...');
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
        const price = p.price; // Use price from catalog
        const imgSrc = p.img;
        const card = document.createElement('div');
        // Make card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Only redirect if NOT clicking the add to cart button
            if (!e.target.closest('.product-add')) {
                window.location.href = `product.html?id=${p.id}`;
            }
        });
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

async function initProductPage() {
    console.log('initProductPage starting...');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        console.log('Product ID from URL:', productId);
        
        const container = document.getElementById('product-page-content');
        if (!container) return;
        
        const product = CATALOG.find(p => p.id === productId);
        
        if (!product) {
            container.innerHTML = `
                <div class="product-not-found" style="text-align:center; padding: 100px 20px;">
                    <h2 style="font-family: var(--serif); font-size: 32px; margin-bottom: 20px;">Treasure Not Found</h2>
                    <p style="color: var(--mid); margin-bottom: 30px;">The piece you're looking for seems to have vanished into our archives.</p>
                    <a href="shop.html" class="btn-primary">Back to Collection</a>
                </div>
            `;
            return;
        }
        
        // Render content
        renderPDP(container, product);
        
        // Re-init reveal for newly added elements
        initScrollReveal();
        
    } catch (error) {
        console.error('Error in initProductPage:', error);
    }
}

function renderPDP(container, product) {
    // Set document title
    document.title = `${product.name} — Kalyra Boutique`;
    
    // Related products (prioritize same category)
    let related = CATALOG.filter(p => p.category === product.category && p.id !== product.id);
    
    // If fewer than 4 items, fill up with other products to maintain a full grid
    if (related.length < 4) {
        const others = CATALOG.filter(p => p.category !== product.category && p.id !== product.id);
        const needed = 4 - related.length;
        related = [...related, ...others.slice(0, needed)];
    } else {
        related = related.slice(0, 4);
    }
    
    container.innerHTML = `
        <div class="pdp-wrapper">
            <div class="pdp-container">
                <div class="pdp-gallery">
                    <div class="pdp-main-img">
                        <img src="${product.img}" alt="${product.name}" id="main-product-image">
                        <div class="pdp-custom-cursor" id="pdp-custom-cursor">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                            </svg>
                        </div>
                        <button class="pdp-zoom-btn" id="pdp-zoom-trigger" aria-label="Zoom image">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                            </svg>
                        </button>
                        <button class="pdp-nav-btn prev" id="pdp-nav-prev" aria-label="Previous image">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button class="pdp-nav-btn next" id="pdp-nav-next" aria-label="Next image">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                    <div class="pdp-thumbnails">
                        <div class="thumb active" onclick="changePDPImage('${product.img}', this)">
                            <img src="${product.img}" alt="${product.name}">
                        </div>
                        <div class="thumb" onclick="changePDPImage('https://placehold.co/600x800/000000/000000', this)">
                            <img src="https://placehold.co/600x800/000000/000000" alt="Placeholder">
                        </div>
                        <div class="thumb" onclick="changePDPImage('https://placehold.co/600x800/000000/000000', this)">
                            <img src="https://placehold.co/600x800/000000/000000" alt="Placeholder">
                        </div>
                        <div class="thumb" onclick="changePDPImage('https://placehold.co/600x800/000000/000000', this)">
                            <img src="https://placehold.co/600x800/000000/000000" alt="Placeholder">
                        </div>
                    </div>
                </div>
                
                <div class="pdp-info">
                    <div class="pdp-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Collection</div>
                    <h1 class="pdp-title">${product.name}</h1>
                    
                    <p class="pdp-price">₹${product.price.toLocaleString()}</p>
                    <p class="pdp-desc">${product.description}</p>
                    
                    <div class="pdp-options">
                        <div class="option-row">
                            <span class="option-label">Size Option</span>
                            <div class="size-pills">
                                <button class="size-pill active">Standard</button>
                                <button class="size-pill">Premium Large</button>
                                <button class="size-pill">Custom Size</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pdp-actions">
                        <button class="btn-add-cart" id="pdp-add-cart">Add to Cart</button>
                        <button class="btn-buy-now" id="pdp-buy-now">Buy Now</button>
                        <button class="btn-share-icon" aria-label="Share">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                        </button>
                    </div>
                    
                    <div class="pdp-accordion">
                        <div class="accordion-item">
                            <button class="accordion-trigger">Piece Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
                            <div class="accordion-content">
                                <p>${product.description} Each piece is uniquely handcrafted using premium materials, ensuring that no two items are exactly alike. Designed to bring a touch of artisanal elegance to your personal space.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <button class="accordion-trigger">Shipping & Delivery <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
                            <div class="accordion-content">
                                <p>Free shipping on orders above ₹2,499. Carefully packaged with eco-friendly materials to ensure your art arrives safely.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <button class="accordion-trigger">Return & Exchange <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
                            <div class="accordion-content">
                                <p>We offer a 48-hour return policy for damaged items. As our pieces are handcrafted, we do not support general returns.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr class="gallery-divider">
            
            <!-- Customer Reviews Section -->
            <section class="reviews-section reveal">
                <div class="reviews-container" id="reviews-container-${product.id}">
                    <!-- Will be populated by renderReviews() -->
                </div>
            </section>
            
            <section class="related-section">
                <div class="section-header-centered">
                    <div class="section-label">You might also love</div>
                    <h2 class="section-title">Similar <em>Treasures</em></h2>
                </div>
                <div class="products-grid grid-4" id="similar-products-grid">
                    ${related.map(r => `
                        <div class="product-card" onclick="window.location.href='product.html?id=${r.id}'">
                            <div class="product-img-wrap">
                                <img src="${r.img}" alt="${r.name}">
                            </div>
                            <div class="product-brand">${r.category.charAt(0).toUpperCase() + r.category.slice(1)}</div>
                            <h3 class="product-name">${r.name}</h3>
                            <p class="product-price">₹${r.price.toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <div class="pdp-sticky-bar" id="pdp-sticky-bar">
                <div class="sticky-info">
                    <div class="sticky-name">${product.name}</div>
                    <div class="sticky-price">₹${product.price.toLocaleString()}</div>
                </div>
                <button class="btn-sticky-add" id="pdp-sticky-add">Add to Cart</button>
            </div>
        </div>

        <div class="pdp-lightbox" id="pdp-lightbox">
            <div class="lightbox-content">
                <img src="${product.img}" alt="${product.name}" class="lightbox-img" id="lightbox-img">
            </div>
            <div class="lightbox-controls">
                <button class="lb-btn" id="lb-prev" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button class="lb-btn close-btn" id="lb-close" aria-label="Close">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
                <button class="lb-btn" id="lb-next" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    `;

    // Lightbox Logic
    const lb = document.getElementById('pdp-lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const mainImg = document.getElementById('main-product-image');

    const openLB = () => {
        lbImg.src = mainImg.src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLB = () => {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.classList.remove('is-zoomed');
        lbImg.style.transform = '';
    };

    // Toggle Zoom in Lightbox (Desktop only)
    lbImg?.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) return;
        
        lbImg.classList.toggle('is-zoomed');
        if (!lbImg.classList.contains('is-zoomed')) {
            lbImg.style.transform = '';
            lbImg.style.transformOrigin = 'center center';
        } else {
            applyZoom(e);
        }
    });

    lbImg?.addEventListener('mousemove', (e) => {
        if (lbImg.classList.contains('is-zoomed') && window.innerWidth > 1024) {
            applyZoom(e);
        }
    });

    function applyZoom(e) {
        const rect = lbImg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        lbImg.style.transformOrigin = `${x}% ${y}%`;
        lbImg.style.transform = 'scale(2.5)';
    }

    mainImg?.addEventListener('click', openLB);
    document.getElementById('pdp-zoom-trigger')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openLB();
    });
    document.getElementById('lb-close')?.addEventListener('click', closeLB);
    lb?.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('lightbox-content')) closeLB();
    });

    document.getElementById('lb-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePDP(-1);
        setTimeout(() => lbImg.src = mainImg.src, 50);
    });

    document.getElementById('lb-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePDP(1);
        setTimeout(() => lbImg.src = mainImg.src, 50);
    });

    // Sticky bar visibility logic
    const stickyBar = document.getElementById('pdp-sticky-bar');
    const mainAction = document.getElementById('pdp-add-cart');
    
    if (stickyBar && mainAction) {
        window.addEventListener('scroll', () => {
            const rect = mainAction.getBoundingClientRect();
            if (rect.bottom < 0) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        });
        
        document.getElementById('pdp-sticky-add')?.addEventListener('click', () => {
            mainAction.click();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Interactions
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
        });
    });
    
    // Action Logic
    document.getElementById('pdp-add-cart')?.addEventListener('click', () => {
        alert(`${product.name} added to cart!`);
    });
    
    document.getElementById('pdp-buy-now')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    
    // Custom Cursor Logic for Desktop
    const mainImgContainer = document.querySelector('.pdp-main-img');
    const customCursor = document.getElementById('pdp-custom-cursor');
    
    if (mainImgContainer && customCursor && window.innerWidth > 1024) {
        mainImgContainer.addEventListener('mouseenter', () => {
            customCursor.style.opacity = '1';
            customCursor.style.visibility = 'visible';
        });

        mainImgContainer.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
            customCursor.style.visibility = 'hidden';
        });

        mainImgContainer.addEventListener('mousemove', (e) => {
            const rect = mainImgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            customCursor.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Hide custom cursor when hovering over navigation buttons
        const navBtns = mainImgContainer.querySelectorAll('.pdp-nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                customCursor.style.opacity = '0';
                customCursor.style.visibility = 'hidden';
            });
            btn.addEventListener('mouseleave', () => {
                customCursor.style.opacity = '1';
                customCursor.style.visibility = 'visible';
            });
        });
    }

    // Initial Reviews Render
    renderReviews(product);
    
    // Setup Gallery Arrows
    setupPDPInteractions();
}

function getReviews(productId) {
    const all = JSON.parse(localStorage.getItem('kalyra_reviews') || '{}');
    return all[productId] || [];
}

function saveReview(productId, review) {
    const all = JSON.parse(localStorage.getItem('kalyra_reviews') || '{}');
    if (!all[productId]) all[productId] = [];
    all[productId].unshift(review);
    localStorage.setItem('kalyra_reviews', JSON.stringify(all));
}

function renderReviews(product) {
    const container = document.getElementById(`reviews-container-${product.id}`);
    if (!container) return;
    
    const reviews = getReviews(product.id);
    const count = reviews.length;
    
    if (count === 0) {
        container.innerHTML = `
            <div class="reviews-header-centered">
                <h2 class="reviews-title">Customer Reviews</h2>
                <div class="overall-rating empty">
                    <div class="stars empty">☆☆☆☆☆</div>
                </div>
                <p class="based-on">Be the first to write a review</p>
            </div>
            <div class="reviews-action">
                <button class="btn-write-review" id="btn-write-review">Write a review</button>
            </div>
            <div id="review-form-container" class="form-collapse-container"></div>
        `;

        // Pre-render form for smooth transition
        showReviewForm(product, true);
    } else {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / count;
        const breakdown = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1
        reviews.forEach(r => { if(r.rating >= 1 && r.rating <= 5) breakdown[5-r.rating]++; });
        
        container.innerHTML = `
            <div class="reviews-header-centered">
                <h2 class="reviews-title">Customer Reviews</h2>
                <div class="overall-rating">
                    <div class="stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</div>
                    <span class="rating-text">${avg.toFixed(2)} out of 5</span>
                </div>
                <p class="based-on">Based on ${count} review${count > 1 ? 's' : ''} <span class="verified-check">✓</span></p>
            </div>

            <div class="reviews-grid">
                <div class="reviews-stats">
                    ${breakdown.map((c, i) => `
                        <div class="rating-bar-row">
                            <div class="stars-label">${'★'.repeat(5-i)}${'☆'.repeat(i)}</div>
                            <div class="progress-bar"><div class="progress" style="width: ${(c/count*100).toFixed(0)}%;"></div></div>
                            <div class="count-label">${c}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="reviews-list">
                    ${reviews.slice(0, 3).map(r => `
                        <div class="review-item">
                            <div class="review-meta">
                                <span class="review-author">${r.name}</span>
                                <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
                            </div>
                            <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                            <h4 class="review-title">${r.title || 'Review'}</h4>
                            <p class="review-text">${r.text}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="reviews-action">
                <button class="btn-write-review" id="btn-write-review">Write a review</button>
            </div>
            <div id="review-form-container" class="form-collapse-container"></div>
        `;

        // Pre-render form for smooth transition
        showReviewForm(product, true);
    }
    
    const writeBtn = document.getElementById('btn-write-review');
    const formWrap = document.getElementById('review-form-container');
    
    writeBtn?.addEventListener('click', () => {
        formWrap.classList.toggle('active');
        if (formWrap.classList.contains('active')) {
            writeBtn.textContent = 'Cancel review';
            setTimeout(() => {
                formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } else {
            writeBtn.textContent = 'Write a review';
        }
    });
}

function showReviewForm(product, silent = false) {
    const formWrap = document.getElementById('review-form-container');
    if (!formWrap) return;
    
    formWrap.innerHTML = `
        <div class="review-form-card">
            <h2 class="reviews-title" style="margin-bottom: 30px;">Write a Review</h2>
            <div class="rating-input">
                <label class="form-label">Overall Rating</label>
                <div class="star-rating-select">
                    <span data-val="5">★</span><span data-val="4">★</span><span data-val="3">★</span><span data-val="2">★</span><span data-val="1">★</span>
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Review Title</label>
                    <input type="text" id="rev-title" placeholder="Give your review a title">
                </div>
                <div class="form-group">
                    <label class="form-label">Review Content</label>
                    <textarea id="rev-text" rows="4" placeholder="Write your comments here"></textarea>
                </div>
                <div class="form-group text-center">
                    <label class="form-label">Picture/Video (Optional)</label>
                    <div class="media-upload-container">
                        <label for="rev-media" class="upload-square">
                            <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        </label>
                        <input type="file" id="rev-media" accept="image/*,video/*" style="display: none;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Display Name</label>
                        <input type="text" id="rev-name" placeholder="Public name (e.g. John D.)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" id="rev-email" placeholder="For verification (private)">
                    </div>
                </div>
            </div>
            
            <p class="data-disclaimer">
                By submitting this review, you agree to our terms. We use your data to verify reviews and improve our service. Your email address will never be shared publicly.
            </p>

            <div class="form-actions">
                <button class="btn-submit-review" id="submit-review">Submit Review</button>
                <button class="btn-cancel-form" id="cancel-review-form">Cancel Review</button>
            </div>
        </div>
    `;

    // Removed automatic scroll here since we handle it in the toggle logic
    /* 
    setTimeout(() => {
        formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100); 
    */
    
    // Handle Cancel button inside form
    formWrap.querySelector('#cancel-review-form')?.addEventListener('click', () => {
        const writeBtn = document.getElementById('btn-write-review');
        if (writeBtn) writeBtn.click(); // Reuse existing toggle logic
    });
    
    let selectedRating = 5;
    const stars = formWrap.querySelectorAll('.star-rating-select span');
    stars.forEach(s => {
        s.addEventListener('click', () => {
            selectedRating = parseInt(s.dataset.val);
            stars.forEach(st => {
                st.classList.toggle('active', parseInt(st.dataset.val) <= selectedRating);
            });
        });
    });

    document.getElementById('submit-review')?.addEventListener('click', () => {
        const title = document.getElementById('rev-title').value || 'Review';
        const name = document.getElementById('rev-name').value || 'Anonymous';
        const email = document.getElementById('rev-email').value;
        const text = document.getElementById('rev-text').value;
        
        if (!text) return alert('Please write a review text');
        if (!email) return alert('Please provide your email');
        
        saveReview(product.id, {
            title,
            name, 
            email,
            text, 
            rating: selectedRating, 
            date: new Date().toISOString()
        });
        
        alert('Thank you for your review!');
        renderReviews(product);
    });
}

function changePDPImage(src, thumb) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
        }, 200);
    }
    
    document.querySelectorAll('.pdp-thumbnails .thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function navigatePDP(direction) {
    const thumbs = Array.from(document.querySelectorAll('.pdp-thumbnails .thumb'));
    const activeIndex = thumbs.findIndex(t => t.classList.contains('active'));
    let nextIndex = activeIndex + direction;
    
    if (nextIndex < 0) nextIndex = thumbs.length - 1;
    if (nextIndex >= thumbs.length) nextIndex = 0;
    
    thumbs[nextIndex].click();
}

// Update Interactions in renderPDP
function setupPDPInteractions() {
    document.getElementById('pdp-nav-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePDP(-1);
    });
    
    document.getElementById('pdp-nav-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePDP(1);
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
