/* ============================================================
   NEURAL NETWORK CANVAS
   ============================================================ */
(function () {
    var canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var isMobile = window.innerWidth < 768;
    var PARTICLE_COUNT = isMobile ? 40 : 75;
    var MAX_DIST = isMobile ? 100 : 140;
    var particles = [];
    var animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function Particle() {
        this.reset = function () {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.6;
            this.alpha = Math.random() * 0.45 + 0.15;
        };
        this.reset();
        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        };
        this.draw = function () {
            var isLight = document.documentElement.dataset.theme === 'light';
            var color = isLight ? '30,30,30' : '200,210,220';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + color + ',' + this.alpha + ')';
            ctx.fill();
        };
    }

    function init() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function drawLines() {
        var isLight = document.documentElement.dataset.theme === 'light';
        var color = isLight ? '30,30,30' : '200,210,220';
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    var a = (1 - d / MAX_DIST) * 0.22;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(' + color + ',' + a + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
        drawLines();
        animId = requestAnimationFrame(loop);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { resize(); init(); }, 200);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancelAnimationFrame(animId);
        else loop();
    });

    resize(); init(); loop();
}());

/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
        var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
    });
}());

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
(function () {
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}());

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
(function () {
    var toggle = document.getElementById('navToggle');
    var links  = document.getElementById('navLinks');
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); });
    });
}());

/* ============================================================
   TYPING EFFECT
   ============================================================ */
(function () {
    var phrases = [
        'Machine Learning Engineer',
        'LLM & Generative AI Systems',
        'AI Agent Developer',
        'RAG Pipeline Engineer',
        'Deep Learning Engineer',
    ];
    var el = document.getElementById('typingText');
    if (!el) return;
    var phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        var current = phrases[phraseIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) { deleting = true; return setTimeout(tick, 2000); }
            setTimeout(tick, 80);
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                return setTimeout(tick, 380);
            }
            setTimeout(tick, 50);
        }
    }
    setTimeout(tick, 700);
}());

/* ============================================================
   PROJECT FILTER
   ============================================================ */
(function () {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            var filter = this.dataset.filter;
            cards.forEach(function (card) {
                var show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });
}());

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function () {
    var els = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) {
        if (el.classList.contains('project-card')) {
            var siblings = el.parentElement.querySelectorAll('.project-card');
            siblings.forEach(function (sib, j) { sib.dataset.delay = j * 60; });
        }
        observer.observe(el);
    });
}());

/* ============================================================
   ACTIVE NAV HIGHLIGHT
   ============================================================ */
(function () {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (section) {
            if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(function (a) {
                    a.style.color = a.getAttribute('href') === '#' + section.id
                        ? 'var(--text-primary)' : '';
                });
            }
        });
    }, { passive: true });
}());

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function () {
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    if (window.matchMedia('(hover: none)').matches) {
        dot.style.display = ring.style.display = 'none';
        return;
    }
    document.addEventListener('mousemove', function (e) {
        dot.style.left = ring.style.left = e.clientX + 'px';
        dot.style.top  = ring.style.top  = e.clientY + 'px';
    });
    var targets = 'a, button, .project-card, .contact-btn, .skill-tag, .filter-btn, .cert-row';
    document.querySelectorAll(targets).forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('expanded'); dot.classList.add('hidden'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('expanded'); dot.classList.remove('hidden'); });
    });
}());
