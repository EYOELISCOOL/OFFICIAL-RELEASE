document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Sticky header
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    let lastScrollTop = 0;
  
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        header.style.transform = `translateY(-${headerHeight}px)`;
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    });
  
    // Product hover effect
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
      });
    });
  
    // Search functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = searchForm.querySelector('input');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.toLowerCase();
      const products = document.querySelectorAll('.product-card');
      products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });
  
  