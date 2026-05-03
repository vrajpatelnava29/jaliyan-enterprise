const products = [
  { name: "Surgical Instruments", category: "surgical", icon: "✂", desc: "Precision-crafted instruments for general and specialized surgeries." },
  { name: "Sutures", category: "surgical", icon: "⪡", desc: "High-tensile strength sutures for optimal wound closure." },
  { name: "Catheters", category: "disposables", icon: "⑂", desc: "Medical grade catheters ensuring patient comfort and safety." },
  { name: "Cannulas", category: "disposables", icon: "⤹", desc: "Sterile IV cannulas for efficient fluid administration." },
  { name: "ECG Products", category: "equipment", icon: "∿", desc: "Accurate ECG electrodes and gels for cardiac monitoring." },
  { name: "Endoscopes", category: "equipment", icon: "⌕", desc: "Advanced visualization tools for diagnostic procedures." },
  { name: "Gloves", category: "disposables", icon: "⍕", desc: "Latex and nitrile gloves for maximum barrier protection." },
  { name: "Oxygen Masks", category: "disposables", icon: "◖", desc: "Comfortable respiratory masks for optimal oxygen delivery." },
  { name: "Syringes", category: "disposables", icon: "⌍", desc: "Disposable, sterile syringes for precise dosage." },
  { name: "Ventilator Circuits", category: "equipment", icon: "⟴", desc: "High-quality breathing circuits for life support systems." },
  { name: "Bone Drills", category: "surgical", icon: "⌏", desc: "Ergonomic orthopedic drills for precision bone surgery." },
  { name: "Bone Plates & Screws", category: "surgical", icon: "⚙", desc: "Titanium and stainless steel implants for fracture fixation." },
  { name: "Hernia Mesh", category: "surgical", icon: "▦", desc: "Biocompatible surgical mesh for hernia repair." },
  { name: "Hypodermic Needles", category: "disposables", icon: "⤊", desc: "Ultra-sharp needles for minimal patient discomfort." },
  { name: "Laparoscopic Instruments", category: "surgical", icon: "⤮", desc: "Minimally invasive instruments for advanced procedures." },
  { name: "Scalpel Blades", category: "surgical", icon: "⌁", desc: "Carbon steel surgical blades for precise incisions." },
  { name: "Wound Care Products", category: "disposables", icon: "⊞", desc: "Advanced dressings and bandages for rapid healing." },
  { name: "Surgical Accessories", category: "surgical", icon: "✢", desc: "Essential accessories supporting operating room efficiency." }
];

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Lenis for buttery smooth scrolling
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    // Handle anchor links for native Lenis smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: -70 });
        }
      });
    });
  }

  // Inject Products
  const grid = document.getElementById('product-grid');
  const renderProducts = (filter) => {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach((product) => {
      const div = document.createElement('div');
      div.className = 'product-card gs-item';
      div.innerHTML = `
        <div class="product-icon-wrapper">
          <div class="product-badge">${product.category}</div>
          <div class="product-icon">${product.icon}</div>
        </div>
        <div class="product-content">
          <h3>${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <a href="#contact" class="product-action" data-product="${product.name}">
            <span>Inquire Now</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `;
      grid.appendChild(div);
    });

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(grid.querySelectorAll('.product-card'), 
        { y: 40, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)", clearProps: "all" }
      );
    }

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  renderProducts('all');

  // Product Inquiry Auto-Fill Activation
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-action');
      if (btn) {
        const productName = btn.getAttribute('data-product');
        const messageInput = document.getElementById('message');
        if (messageInput && productName) {
          messageInput.value = `Hello, I am interested in inquiring about your ${productName}. Please provide more information.`;
        }
      }
    });
  }

  // Product Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  // Mobile Menu
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !e.target.closest('.nav-container')) {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
      }
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const updateNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNavbar);
  updateNavbar(); // Initialize on load

  // Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(a => {
      a.classList.remove('active');
      if (current && a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initialize on load

  // Smooth Ambient Background Parallax (Behind the site)
  const ambientBg = document.querySelector('.ambient-bg');
  if (ambientBg && typeof gsap !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to the center of the screen
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      gsap.to(ambientBg, {
        x: x, y: y, duration: 2.5, ease: "power3.out", overwrite: "auto"
      });
    });

    // Smooth vertical scroll parallax for individual background blobs
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('.ambient-blob-1', { y: 300, ease: "none", scrollTrigger: { scrub: 1.5 } });
      gsap.to('.ambient-blob-2', { y: -300, ease: "none", scrollTrigger: { scrub: 2 } });
      gsap.to('.ambient-blob-3', { y: 200, ease: "none", scrollTrigger: { scrub: 1 } });
    }
  }

  // Hero Parallax Effect
  const heroSection = document.querySelector('.hero');
  const abstractShape = document.querySelector('.abstract-shape');
  const heroLogo = document.querySelector('.hero-logo-large');
  
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const moveX = (clientX - centerX) / (width / 2);
      const moveY = (clientY - centerY) / (height / 2);

      if (abstractShape) gsap.to(abstractShape, { x: moveX * 40, y: moveY * 40, duration: 1.5, ease: "power3.out", overwrite: "auto" });
      if (heroLogo) gsap.to(heroLogo, { x: moveX * -20, y: moveY * -20, rotationY: moveX * 10, rotationX: -moveY * 10, duration: 1.5, ease: "power3.out", overwrite: "auto" });
    });

    heroSection.addEventListener('mouseleave', () => {
      if (abstractShape) gsap.to(abstractShape, { x: 0, y: 0, duration: 1.5, ease: "power3.out" });
      if (heroLogo) gsap.to(heroLogo, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1.5, ease: "power3.out" });
    });
  }

  // Advertisement 3D Layout Parallax
  const adContainer = document.querySelector('.ad-3d-container');
  const adCard = document.querySelector('.ad-3d-card');
  
  if (adContainer && adCard && typeof gsap !== 'undefined') {
    adContainer.addEventListener('mousemove', (e) => {
      const rect = adContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 12; // Max 12 deg rotation
      const moveY = ((e.clientY - centerY) / (rect.height / 2)) * -12; 
      
      gsap.to(adCard, { rotationY: moveX, rotationX: moveY, duration: 0.5, ease: "power2.out", transformPerspective: 1200, overwrite: "auto" });
    });

    adContainer.addEventListener('mouseleave', () => {
      gsap.to(adCard, { rotationY: 0, rotationX: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
    });

    // 3D Scrolling Out Side Display Animation
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(adContainer,
        { 
          rotationX: 70,       // Laid flat backward
          rotationY: -30,      // Twisted to the left
          rotationZ: -15,      // Dutch angle tilt
          y: 350,              // Coming from below
          z: -1200,            // Deep inside the background
          opacity: 0,
          scale: 0.3
        },
        { 
          rotationX: 0, rotationY: 0, rotationZ: 0, y: 0, z: 0, opacity: 1, scale: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".global-ad-section",
            start: "top 95%",      // Trigger as soon as it enters
            end: "center 55%",     // Finish just before passing center
            scrub: 2               // Ultra-smooth luxurious lag
          }
        }
      );
    }
  }

  // GSAP Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Smart Scroll Reveal (Perfect Staggering + Unlocks CSS Hovers)
    ScrollTrigger.batch('.gs-item', {
      onEnter: batch => gsap.fromTo(batch, 
        { autoAlpha: 0, y: 50, scale: 0.98 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all", overwrite: true }
      ),
      start: "top 85%",
      once: true
    });

    // Feature Panels Sequence
    ScrollTrigger.batch(".gs-panel", {
      onEnter: batch => gsap.fromTo(batch,
        { autoAlpha: 0, y: 50, rotationX: -10 },
        { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", transformPerspective: 1000, clearProps: "all", overwrite: true }
      ),
      start: "top 85%",
      once: true
    });
  }

  // Active Contact Form (AJAX via FormSubmit)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          btn.textContent = 'Message Sent!';
          btn.style.backgroundColor = '#00E5FF';
          btn.style.borderColor = '#00E5FF';
          btn.style.color = '#050914';
          btn.style.boxShadow = '0 8px 25px rgba(0, 229, 255, 0.3)';
          btn.style.opacity = '1';
          
          form.reset();
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.style.boxShadow = '';
            btn.style.pointerEvents = 'auto';
          }, 4000);
          
          // Show Success Modal Pop-up
          const successModal = document.getElementById('successModal');
          if (successModal) successModal.classList.remove('hidden');
        } else {
          throw new Error(json.message || "Something went wrong");
        }
      })
      .catch(error => {
        btn.textContent = 'Error Sending';
        btn.style.backgroundColor = '#ef4444';
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#fff';
        btn.style.opacity = '1';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.style.pointerEvents = 'auto';
        }, 4000);
      });
    });
  }

  // Close Success Modal
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');

  const hideModal = () => {
    if (successModal) {
      successModal.classList.add('hidden');
    }
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
  if (successModal) {
    // Close if the overlay (the modal itself) is clicked, but not its content
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) hideModal();
    })
  }
});

// Preloader & Initial Page Load Sequence
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ delay: 0.3 }); // Wait briefly for preloader to start fading
      tl.from(".navbar", { y: -20, opacity: 0, duration: 1, ease: "power3.out" })
        .from(".gs-hero", { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", clearProps: "all" }, "-=0.6")
        .from(".gs-hero-visual", { scale: 0.9, opacity: 0, duration: 1.5, ease: "expo.out", clearProps: "all" }, "-=0.8");
    }
  }
});