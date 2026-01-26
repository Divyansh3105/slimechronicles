
let soundEnabled = true;
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
function toggleMobileMenu() {
    console.log('toggleMobileMenu called');

    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!toggle || !mobileNav) {
        console.error('Mobile menu elements not found:', { toggle, mobileNav });
        return;
    }

    const isActive = mobileNav.classList.contains('active');

    if (!isActive) {
        // Enable pointer events for active nav
        mobileNav.style.pointerEvents = 'auto';

        mobileNav.style.display = 'flex';
        mobileNav.style.position = 'fixed';
        mobileNav.style.top = '0';
        mobileNav.style.left = '0';
        mobileNav.style.right = '0';
        mobileNav.style.bottom = '0';
        mobileNav.style.width = '100vw';
        mobileNav.style.height = '100vh';
        mobileNav.style.zIndex = '9999';
        mobileNav.style.background = 'linear-gradient(135deg, rgba(10, 14, 39, 0.98), rgba(21, 27, 61, 0.95), rgba(10, 14, 39, 0.98))';
        mobileNav.style.backdropFilter = 'blur(25px)';
        mobileNav.style.flexDirection = 'column';
        mobileNav.style.alignItems = 'center';
        mobileNav.style.justifyContent = 'center';
        mobileNav.style.gap = '1rem';
        mobileNav.style.padding = '2rem';
        mobileNav.style.overflow = 'hidden';

        // Style nav links
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach((link, index) => {
            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.gap = '1.2rem';
            link.style.padding = '1.2rem 2rem';
            link.style.fontSize = '1.3rem';
            link.style.fontWeight = '600';
            link.style.color = '#ffffff';
            link.style.textDecoration = 'none';
            link.style.borderRadius = '16px';
            link.style.width = '300px';
            link.style.maxWidth = '85vw';
            link.style.justifyContent = 'flex-start';
            link.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))';
            link.style.border = '1px solid rgba(255, 255, 255, 0.12)';
            link.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.zIndex = '10000';
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            link.style.fontFamily = 'Rajdhani, sans-serif';
            link.style.letterSpacing = '0.5px';

            // Animate in
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + (index * 50));

            // Style icons
            const icon = link.querySelector('.nav-icon');
            if (icon) {
                icon.style.fontSize = '1.6rem';
                icon.style.display = 'inline-flex';
                icon.style.alignItems = 'center';
                icon.style.justifyContent = 'center';
                icon.style.width = '2.5rem';
                icon.style.height = '2.5rem';
                icon.style.background = 'rgba(77, 212, 255, 0.1)';
                icon.style.borderRadius = '10px';
                icon.style.transition = 'all 0.3s ease';
            }

            // Add hover effects
            const addHoverEffect = () => {
                link.style.background = 'linear-gradient(135deg, rgba(77, 212, 255, 0.25), rgba(77, 212, 255, 0.15))';
                link.style.color = '#4dd4ff';
                link.style.borderColor = 'rgba(77, 212, 255, 0.4)';
                link.style.transform = 'translateX(8px) scale(1.02)';
                link.style.boxShadow = '0 8px 25px rgba(77, 212, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';

                const icon = link.querySelector('.nav-icon');
                if (icon) {
                    icon.style.background = 'rgba(77, 212, 255, 0.2)';
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            };

            const removeHoverEffect = () => {
                link.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))';
                link.style.color = '#ffffff';
                link.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                link.style.transform = 'translateX(0) scale(1)';
                link.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';

                const icon = link.querySelector('.nav-icon');
                if (icon) {
                    icon.style.background = 'rgba(77, 212, 255, 0.1)';
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            };

            // Event listeners
            link.addEventListener('mouseenter', addHoverEffect);
            link.addEventListener('mouseleave', removeHoverEffect);
            link.addEventListener('touchstart', addHoverEffect, { passive: true });
            link.addEventListener('touchend', removeHoverEffect, { passive: true });
        });

        // Style close button
        const closeBtn = mobileNav.querySelector('.mobile-nav-close');
        if (closeBtn) {
            closeBtn.style.display = 'flex';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '2rem';
            closeBtn.style.right = '2rem';
            closeBtn.style.width = '56px';
            closeBtn.style.height = '56px';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
            closeBtn.style.border = '2px solid rgba(255, 255, 255, 0.2)';
            closeBtn.style.color = '#ffffff';
            closeBtn.style.fontSize = '1.6rem';
            closeBtn.style.fontWeight = 'bold';
            closeBtn.style.alignItems = 'center';
            closeBtn.style.justifyContent = 'center';
            closeBtn.style.zIndex = '10001';
            closeBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            closeBtn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            closeBtn.style.cursor = 'pointer';

            // Animate in
            closeBtn.style.opacity = '0';
            closeBtn.style.transform = 'scale(0.8) rotate(-90deg)';
            setTimeout(() => {
                closeBtn.style.opacity = '1';
                closeBtn.style.transform = 'scale(1) rotate(0deg)';
            }, 200);

            // Hover effects
            const addCloseHover = () => {
                closeBtn.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))';
                closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
                closeBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            };

            const removeCloseHover = () => {
                closeBtn.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
                closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                closeBtn.style.transform = 'scale(1) rotate(0deg)';
                closeBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            };

            closeBtn.addEventListener('mouseenter', addCloseHover);
            closeBtn.addEventListener('mouseleave', removeCloseHover);
            closeBtn.addEventListener('touchstart', addCloseHover, { passive: true });
            closeBtn.addEventListener('touchend', removeCloseHover, { passive: true });
        }

        // Create particles
        createMobileNavParticles(mobileNav);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

    } else {
        // Disable pointer events for inactive nav
        mobileNav.style.pointerEvents = 'none';

        // Restore body scroll
        document.body.style.overflow = '';

        // Remove particles
        const particles = mobileNav.querySelectorAll('.mobile-nav-particle');
        particles.forEach(particle => particle.remove());
    }

    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');

    if (soundEnabled && window.SoundFeedback) {
        window.SoundFeedback.playEffect('click');
    }
}
function createMobileNavParticles(container) {
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'mobile-nav-particle';
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(77, 212, 255, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';

        particle.style.transform = `translate3d(${Math.random() * 100}vw, ${Math.random() * 100}vh, 0)`;
        particle.style.animation = `mobileNavParticleFloat ${8 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';

        particle.style.willChange = 'transform';

        container.appendChild(particle);
    }
}
function initMobileNavigation() {

    setViewportHeight();


    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });


    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });


    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobile-nav');
        const toggle = document.querySelector('.mobile-menu-toggle');

        if (mobileNav && mobileNav.classList.contains('active') &&
            !mobileNav.contains(e.target) &&
            !toggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });


    const cards = document.querySelectorAll('.stat-card, .state-card, .badge');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });


    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    }
}
document.addEventListener('DOMContentLoaded', initMobileNavigation);
