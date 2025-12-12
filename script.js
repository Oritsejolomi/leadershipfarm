document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-center');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = navList.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Light/Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (themeToggle) {
            // If light mode (savedTheme is 'light-mode'), show Moon (to switch to dark). 
            // Logic: Default is Dark (Sun icon visible to switch to light?). 
            // Usually: Dark Mode site -> Button shows Sun (to make it bright). Light Mode site -> Button shows Moon (to make it dark).
            // My Base is Dark. So default button should be Sun? Or should it represent Current State?
            // User said: "should be wither moon or sun".
            // Standard: Icon represents the Target state.
            // If Dark (Default): Show Sun (Target: Light).
            // If Light: Show Moon (Target: Dark).
            themeToggle.innerHTML = savedTheme === 'light-mode' ? moonIcon : sunIcon;
        }
    } else {
        // Default is Dark, so show Sun to switch to Light
        if (themeToggle) themeToggle.innerHTML = sunIcon;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLightMode = body.classList.contains('light-mode');

            // Update button icon
            themeToggle.innerHTML = isLightMode ? moonIcon : sunIcon;

            // Save preference
            localStorage.setItem('theme', isLightMode ? 'light-mode' : '');
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.mission-card, .section-title, .lead, .about-img, .display-text');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
        // Add delay based on index for staggered effect if siblings
        // This is a simple implementation, for more complex grids we'd calculate delay based on row/col
        observer.observe(el);
    });

    // Add 'visible' class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Service Bouquet Collapsible
    const serviceGroups = document.querySelectorAll('.service-title-group');
    serviceGroups.forEach(group => {
        group.addEventListener('click', () => {
            const row = group.closest('.service-row');
            const content = row.querySelector('.service-content');

            // Toggle active state
            row.classList.toggle('active');

            // Handle max-height for smooth animation
            if (row.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats-premium');
    const statsNumbers = document.querySelectorAll('.stat-number');

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsNumbers.forEach(stat => {
                        const target = +stat.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // 60fps

                        let current = 0;
                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                stat.innerText = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCount);
                            } else {
                                stat.innerText = target.toLocaleString();
                            }
                        };
                        updateCount();
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }
});
