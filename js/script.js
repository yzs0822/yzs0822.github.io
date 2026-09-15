
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            
            // Preloader
            window.addEventListener('load', function() {
                const preloader = document.getElementById('preloader');
                setTimeout(function() {
                    preloader.style.opacity = '0';
                    setTimeout(function() {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000);
            });
            
            // Initialize AOS (Animate On Scroll)
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
            
            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 100) {
                    navbar.style.padding = '10px 0';
                    navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.padding = '15px 0';
                    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                }
            });
            
            // CLOSE MOBILE MENU WHEN LINK IS CLICKED
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .nav-cta-btn');
            const navbarCollapse = document.getElementById('navbarNav');
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
            
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Check if navbar is collapsed (mobile view)
                    if (navbarCollapse.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                });
            });
            
            // ACTIVE NAV LINK ON SCROLL
            const sections = document.querySelectorAll('section[id]');
            const navItems = document.querySelectorAll('.navbar-nav .nav-link');
            
            // Function to update active nav link
            function updateActiveNavLink() {
                let scrollPosition = window.scrollY + 100;
                
                // Loop through sections to find which one is in view
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        // Remove active class from all nav links
                        navItems.forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        // Add active class to corresponding nav link
                        const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
                
                // Special case for hero section (home)
                if (scrollPosition < 100) {
                    navItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    const homeLink = document.querySelector('.navbar-nav .nav-link[href="#home"]');
                    if (homeLink) homeLink.classList.add('active');
                }
            }
            
            // Run on scroll
            window.addEventListener('scroll', updateActiveNavLink);
            
            // Also run when page loads
            updateActiveNavLink();
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if(targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Update active nav link after click
                        setTimeout(updateActiveNavLink, 500);
                    }
                });
            });
            
            // Counter animation
            const counters = document.querySelectorAll('.counter');
            const speed = 200;
            
            const animateCounters = () => {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-count');
                        const count = +counter.innerText;
                        
                        const increment = target / speed;
                        
                        if(count < target) {
                            counter.innerText = Math.ceil(count + increment);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                });
            };
            
            // Trigger counter animation when in viewport
            const aboutSection = document.getElementById('about');
            const observerOptions = {
                threshold: 0.5
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            if(aboutSection) {
                observer.observe(aboutSection);
            }
            
            // Scroll to top button
            const scrollToTopBtn = document.getElementById('scrollToTop');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('active');
                } else {
                    scrollToTopBtn.classList.remove('active');
                }
            });
            
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Gallery Lightbox
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxClose = document.querySelector('.lightbox-close');
            
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const imgSrc = this.querySelector('img').getAttribute('src');
                    lightboxImg.setAttribute('src', imgSrc);
                    lightbox.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            });
            
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            lightbox.addEventListener('click', function(e) {
                if(e.target === lightbox) {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Contact Form Submission
            const contactForm = document.getElementById('contactForm');
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            });
// AOS 兜底：如果 1.5 秒后某个元素还没拿到 .aos-animate，就手动加上，防止不显示
window.addEventListener('load', function () {
    setTimeout(function () {
        document.querySelectorAll('[data-aos]').forEach(function (el) {
            if (!el.classList.contains('aos-animate')) {
                el.classList.add('aos-animate');
            }
        });
    }, 1500);
});
        });
