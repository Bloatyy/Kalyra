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
        const response = await fetch(filePath);
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

    // Initialize all functionality after components are loaded
    setTimeout(() => {
        initNavbarScroll();
        initScrollReveal();
        initFaqAccordion();
    }, 100);
}

async function loadGalleryStrip() {
    const galleryHTML = `
    <div class="gallery-strip">
      <div class="gallery-track">
        <div class="gallery-item"><img src="https://framerusercontent.com/images/MKTdbezeqUUrolGltUOAIG3sRg.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/GxJ7bqRid5liIOB1FVg9TZJ7M.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/bZNGs9VJC7dswgDkCkX7iLc7U.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/f9qA5AbcJUKCtArMaR0MghhX6vc.png?width=900&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/Yrh7HbbMCn3HXrqSrrnlohbLI.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/uhZKyF3IWQelSEWD8lMHvnmvc4.png?width=1200&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/Ht0OY1QpaA0q8bQCoeKDLunXoM.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/tqlWY6b3WGtxl97y8EeyoFtVJY.jpg?width=900&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/MKTdbezeqUUrolGltUOAIG3sRg.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/GxJ7bqRid5liIOB1FVg9TZJ7M.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/bZNGs9VJC7dswgDkCkX7iLc7U.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/f9qA5AbcJUKCtArMaR0MghhX6vc.png?width=900&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/Yrh7HbbMCn3HXrqSrrnlohbLI.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/uhZKyF3IWQelSEWD8lMHvnmvc4.png?width=1200&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/Ht0OY1QpaA0q8bQCoeKDLunXoM.png?width=960&height=1200" alt="beauty"></div>
        <div class="gallery-item"><img src="https://framerusercontent.com/images/tqlWY6b3WGtxl97y8EeyoFtVJY.jpg?width=900&height=1200" alt="beauty"></div>
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

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', loadAllComponents);