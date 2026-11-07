
/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var label = btn.querySelector('.theme-name');
    function apply(t) {
        document.documentElement.dataset.theme = t;
        try { localStorage.setItem('theme', t); } catch (e) {}
        if (label) label.textContent = t === 'dark' ? 'Dark' : 'Light';
    }
    apply(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    btn.addEventListener('click', function () {
        apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
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
            siblings.forEach(function (sib, j) { sib.dataset.delay = (j % 3) * 70; });
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

/* full project description on hover, since cards show one line */
document.querySelectorAll('.project-desc, .project-title').forEach(function (el) { el.title = el.textContent.trim(); });


/* ============================================================
   PROJECT GROUPS, CARD SPOTLIGHT, SCROLL PROGRESS
   ============================================================ */
(function () {
    var groups = document.querySelectorAll('.project-group');
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var f = btn.dataset.filter;
            groups.forEach(function (g) {
                g.hidden = f !== 'all' && g.dataset.group !== f;
                if (g.hidden) return;
                g.querySelectorAll('.reveal').forEach(function (el) { el.style.transitionDelay = '0ms'; el.classList.add('visible'); });
                g.querySelectorAll('.project-card').forEach(function (c, i) {
                    c.classList.remove('filter-in'); void c.offsetWidth;
                    c.style.animationDelay = Math.min(i, 8) * 35 + 'ms';
                    c.classList.add('filter-in');
                });
            });
        });
    });

    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.project-card').forEach(function (c) {
            c.addEventListener('pointermove', function (e) {
                var r = c.getBoundingClientRect();
                c.style.setProperty('--mx', e.clientX - r.left + 'px');
                c.style.setProperty('--my', e.clientY - r.top + 'px');
            });
        });
    }

    var bar = document.getElementById('scrollProgress'), queued = false;
    function paint() {
        queued = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    }
    window.addEventListener('scroll', function () {
        if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
}());


/* ============================================================
   RESUME ROLE MENU
   ============================================================ */
(function () {
    var menus = document.querySelectorAll('.resume-menu');
    function closeAll(except) {
        menus.forEach(function (m) { if (m !== except) m.removeAttribute('open'); });
    }
    menus.forEach(function (m) {
        m.addEventListener('toggle', function () { if (m.open) closeAll(m); });
        m.querySelector('.resume-list').addEventListener('click', function () { m.removeAttribute('open'); });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.resume-menu')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
}());


/* ============================================================
   CARD TILT, STAGGER, HOVER TIMING
   ============================================================ */
(function () {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ['.skills-grid', '.edu-list', '.cert-list'].forEach(function (sel) {
        var box = document.querySelector(sel);
        if (!box) return;
        Array.prototype.forEach.call(box.querySelectorAll('.reveal'), function (el, i) { el.dataset.delay = (i % 3) * 70; });
    });
    /* a reveal delay must not linger and slow hover effects */
    document.addEventListener('transitionend', function (e) {
        var t = e.target;
        if (t.classList && t.classList.contains('visible') && t.style.transitionDelay) t.style.transitionDelay = '';
    });
    if (calm || !window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.project-card').forEach(function (c) {
        c.addEventListener('pointermove', function (e) {
            var r = c.getBoundingClientRect();
            c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 5 + 'deg');
            c.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 5 + 'deg');
        });
        c.addEventListener('pointerleave', function () {
            c.style.removeProperty('--rx'); c.style.removeProperty('--ry');
        });
    });
}());


/* ============================================================
   LIVE BACKGROUND: drifting dots that connect, site-wide
   ============================================================ */
(function () {
    var canvas = document.getElementById('techBg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = [], w = 0, h = 0, dpr = 1, link = 130, rgb = '244,239,228', dotA = .5, lineA = .2;
    var pointer = { x: -9999, y: -9999 };
    var last = 0, raf = 0;

    function theme() {
        var light = document.documentElement.dataset.theme === 'light';
        rgb = light ? '44,43,38' : '226,221,210';
        dotA = light ? .34 : .5;
        lineA = light ? .15 : .2;
    }
    function seed() {
        var want = Math.max(36, Math.min(130, Math.round(w * h / 13000)));
        link = w < 768 ? 95 : 130;
        dots = [];
        for (var i = 0; i < want; i++) {
            dots.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - .5) * .34, vy: (Math.random() - .5) * .34,
                r: Math.random() * 1.1 + .9
            });
        }
    }
    function size() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        var i, k, a, b, dx, dy, d;
        for (i = 0; i < dots.length; i++) {
            a = dots[i];
            for (k = i + 1; k < dots.length; k++) {
                b = dots[k];
                dx = a.x - b.x; dy = a.y - b.y;
                if (dx > link || dx < -link || dy > link || dy < -link) continue;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d < link) {
                    ctx.strokeStyle = 'rgba(' + rgb + ',' + (lineA * (1 - d / link)).toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
            dx = a.x - pointer.x; dy = a.y - pointer.y;
            d = Math.sqrt(dx * dx + dy * dy);
            if (d < link * 1.5) {
                ctx.strokeStyle = 'rgba(' + rgb + ',' + (lineA * 1.8 * (1 - d / (link * 1.5))).toFixed(3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(' + rgb + ',' + dotA + ')';
            ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
        }
    }
    function step() {
        for (var i = 0; i < dots.length; i++) {
            var p = dots[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        }
    }
    function loop(t) {
        raf = requestAnimationFrame(loop);
        if (t - last < 32) return;   /* about 30 frames a second */
        last = t;
        step(); draw();
    }
    function start() { cancelAnimationFrame(raf); if (!calm) raf = requestAnimationFrame(loop); }

    theme(); size(); seed(); draw(); start();

    var timer;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { size(); seed(); draw(); }, 200);
    });
    new MutationObserver(function () { theme(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
        document.addEventListener('pointerleave', function () { pointer.x = pointer.y = -9999; });
    }
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancelAnimationFrame(raf); else start();
    });
}());
