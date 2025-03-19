document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".toggle-filters");
    const filtersSection = document.querySelector(".filters");
    const filterCategories = document.querySelectorAll(".filter-category");

    // Start with filters collapsed
    filterCategories.forEach(category => {
        category.style.display = "none";
    });

    toggleButton.addEventListener("click", function () {
        filterCategories.forEach(category => {
            if (category.style.display === "none") {
                category.style.display = "block";
            } else {
                category.style.display = "none";
            }
        });

        toggleButton.textContent = toggleButton.textContent === "Hide Filters" ? "Show Filters" : "Hide Filters";
    });
});
