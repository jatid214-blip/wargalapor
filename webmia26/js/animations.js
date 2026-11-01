/* ========================================
   WargaLapor — Animations & Scroll Effects
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimation();
    initBarAnimations();
    initParallax();
});

/* ========================================
   Scroll Reveal Animations
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children if needed
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 100}ms`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.process-card, .stat-card, .feed-card, .pillar-card, .info-card, ' +
        '.faq-item, .insight-chart-card, .section-header, .map-container, ' +
        '.form-container, .dashboard-card, .team-card, .report-item, ' +
        '.timeline-item, .about-grid'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 4) * 100}ms`;
        observer.observe(el);
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const format = element.dataset.format || 'full';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        let current = Math.floor(eased * target);
        
        if (format === 'short' && current >= 1000) {
            element.textContent = (current / 1000).toFixed(1) + 'k' + suffix;
        } else {
            element.textContent = current.toLocaleString('id-ID') + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ========================================
   Bar Chart Animations
   ======================================== */
function initBarAnimations() {
    const bars = document.querySelectorAll('.bar');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));

    // Region bars
    const regionBars = document.querySelectorAll('.region-fill');
    const regionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 300);
                
                regionObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    regionBars.forEach(bar => regionObserver.observe(bar));
}

/* ========================================
   Parallax Effects
   ======================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll < window.innerHeight) {
            const pattern = hero.querySelector('.hero-bg-pattern');
            if (pattern) {
                pattern.style.transform = `translateY(${scroll * 0.3}px)`;
            }
        }
    });
}

/* ========================================
   Typing Effect (optional)
   ======================================== */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ========================================
   Ripple Effect on Buttons
   ======================================== */
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
    `;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);
