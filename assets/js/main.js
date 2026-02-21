/**
 * KEVYN BEZERRA — ANALISTA DE DADOS
 * JavaScript simplificado e focado
 */

// ============================================
// UTILS
// ============================================
const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('navMenu');
        this.links = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
        
        this.toggle?.addEventListener('click', () => this.toggleMenu());
        
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollTo(target);
                this.closeMenu();
            });
        });
    },

    handleScroll() {
        this.navbar.classList.toggle('scrolled', window.scrollY > 50);
        this.updateActiveLink();
    },

    updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    },

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', this.menu.classList.contains('active'));
    },

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    },

    scrollTo(target) {
        const el = document.querySelector(target);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }
};

// ============================================
// PARTICLE CANVAS
// ============================================
const ParticleCanvas = {
    init() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        const count = window.innerWidth < 768 ? 30 : 50;
        this.particles = Array.from({ length: count }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        }));
    },

    bindEvents() {
        window.addEventListener('resize', debounce(() => {
            this.resize();
            this.createParticles();
        }, 200));
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            this.ctx.fill();
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 120)})`;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
};

// ============================================
// NUMBER ANIMATION
// ============================================
const NumberAnimation = {
    init() {
        this.stats = document.querySelectorAll('.stat-number');
        if (!this.stats.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.hero-stats'));
    },

    animate() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const start = performance.now();
            
            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.floor(ease * target);
                
                if (progress < 1) requestAnimationFrame(update);
            };
            
            requestAnimationFrame(update);
        });
    }
};

// ============================================
// CONTACT FORM
// ============================================
const ContactForm = {
    init() {
        this.form = document.getElementById('contatoForm');
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input, textarea');
        let valid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) valid = false;
        });
        
        if (!valid) return;
        
        const btn = this.form.querySelector('button[type="submit"]');
        btn.classList.add('loading');
        btn.disabled = true;
        
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('success');
            
            setTimeout(() => {
                this.form.reset();
                btn.classList.remove('success');
                btn.disabled = false;
            }, 2000);
        }, 1500);
    }
};

// ============================================
// BACK TO TOP
// ============================================
const BackToTop = {
    init() {
        this.btn = document.getElementById('backToTop');
        if (!this.btn) return;
        
        window.addEventListener('scroll', debounce(() => this.toggle(), 100));
        this.btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    toggle() {
        this.btn.classList.toggle('visible', window.scrollY > 400);
    }
};

// ============================================
// CONSOLE EASTER EGG
// ============================================
const ConsoleEasterEgg = {
    init() {
        console.log('%c👋 Olá, recrutador!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
        console.log('%cSou Kevyn Bezerra, Analista de Dados.', 'color: #06b6d4; font-size: 14px;');
        console.log('%c📧 kevynfirst@gmail.com | 💼 linkedin.com/in/kevynfirst', 'color: #64748b; font-size: 12px;');
    }
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    ParticleCanvas.init();
    NumberAnimation.init();
    ContactForm.init();
    BackToTop.init();
    ConsoleEasterEgg.init();
});
