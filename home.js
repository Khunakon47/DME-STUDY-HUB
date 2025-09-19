feather.replace();

document.addEventListener('DOMContentLoaded', () => {
  
  // ฟังก์ชันสำหรับสร้าง Intersection Observer แบบทั่วไป
  function createObserver(callback, options = { threshold: 0.3 }) {
    return new IntersectionObserver(callback, options);
  }

  // ฟังก์ชันสำหรับ animate elements พร้อม staggered delay
  function animateElementsWithDelay(elements, baseDelay = 300, stepDelay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => element.classList.add("visible"), baseDelay + index * stepDelay);
    });
  }

  // ฟังก์ชันสำหรับ observe section และ animate cards
  function observeSectionWithCards(sectionSelector, cardSelector, options = {}) {
    const {
      threshold = 0.3,
      baseDelay = 300,
      stepDelay = 100,
      sectionClass = 'visible'
    } = options;
    
    const section = document.querySelector(sectionSelector);
    const cards = document.querySelectorAll(cardSelector);

    if (!section) return;

    const observer = createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add(sectionClass);
          animateElementsWithDelay(cards, baseDelay, stepDelay);
          observer.unobserve(section);
        }
      });
    }, { threshold });

    observer.observe(section);
  }

  // ฟังก์ชันสำหรับ observe แต่ละ element แยกกัน
  function observeIndividualElements(selectors, options = {}) {
    const { threshold = 0.4, className = 'visible' } = options;
    
    const observer = createObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  // ฟังก์ชันสำหรับ toggle dropdown
  function setupDropdownToggle(triggerSelector, dropdownSelector, otherDropdowns = []) {
    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const dropdown = document.querySelector(dropdownSelector);
      
      // ปิด dropdown อื่นๆ
      otherDropdowns.forEach(selector => {
        const otherDropdown = document.querySelector(selector);
        if (otherDropdown) otherDropdown.style.display = 'none';
      });
      
      // Toggle dropdown ปัจจุบัน
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  // === การใช้งาน ===

  // Hero section
  const heroText = document.getElementById('heroText');
  const heroImg = document.querySelector('.hero-image');
  if (heroText && heroImg) {
    const heroObserver = createObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          heroText.classList.add('reveal');
          heroImg.classList.add('reveal');
          heroObserver.unobserve(heroText);
        }
      });
    }, { threshold: 0.5 });
    heroObserver.observe(heroText);
  }

  // Features และ Latest sections
  observeSectionWithCards(".key-features-section", ".feature-card");
  observeSectionWithCards(".latest-notes-section", ".latest-notes-section .card", {
    threshold: 0.25
  });

  // Top Contributors section
  observeSectionWithCards(".top-contributors-section", ".contributor-card", {
    threshold: 0.4,
    baseDelay: 400,
    stepDelay: 120
  });

  // Quickstart section
  observeSectionWithCards(".quickstart-pro", ".quickstart-step", {
    threshold: 0.4,
    baseDelay: 400,
    stepDelay: 150
  });

  // FAQ section
  observeSectionWithCards(".faq-section", ".faq-item", {
    baseDelay: 150,
    stepDelay: 150
  });

  // Testimonial section  
  observeSectionWithCards(".testimonial-section", ".testimonial-card", {
    stepDelay: 150
  });

  // About และ CTA sections (individual elements)
  observeIndividualElements([
    ".about-text", 
    ".about-image", 
    ".cta-content", 
    ".cta-image"
  ]);

  // FAQ toggle functionality
  document.querySelectorAll(".faq-item").forEach(item => {
    const button = item.querySelector(".faq-question");
    if (button) {
      button.addEventListener("click", () => {
        const openItem = document.querySelector(".faq-item.open");
        if (openItem && openItem !== item) {
          openItem.classList.remove("open");
        }
        item.classList.toggle("open");
      });
    }
  });

  // Dropdown menus
  setupDropdownToggle('.notification-btn', '.notification-dropdown', ['.profile-dropdown']);
  setupDropdownToggle('.profile-btn', '.profile-dropdown', ['.notification-dropdown']);

  // Click outside to close dropdowns
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.notification-menu') && !e.target.closest('.profile-menu')) {
      document.querySelectorAll('.notification-dropdown, .profile-dropdown')
        .forEach(d => d.style.display = 'none');
    }
  });
});

// Navbar scroll effect
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// Footer year
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}