document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    const navLinks = document.querySelector('.nav-links');

    searchBar.addEventListener('focus', function() {
        this.style.width = '100%';
        this.style.borderRadius = '0';
        this.style.border = 'none';
        this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        navLinks.style.opacity = '0';
        navLinks.style.pointerEvents = 'none'; // Disable clicks on nav links
    });

    searchBar.addEventListener('blur', function() {
        if (this.value === '') {
            this.style.width = '200px';
            this.style.borderRadius = '20px';
            this.style.border = '1px solid #ccc';
            this.style.boxShadow = 'none';
            navLinks.style.opacity = '1';
            navLinks.style.pointerEvents = 'auto'; // Enable clicks on nav links
        }
    });

    searchButton.addEventListener('click', function() {
        searchBar.focus();
    });
});