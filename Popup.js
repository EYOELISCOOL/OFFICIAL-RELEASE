const showCountriesButton = document.getElementById("showCountries");
const countryList = document.getElementById("countryList");
const continueButton = document.getElementById("continueButton");
let selectedCountry = null;

// Fetch all countries except Netherlands
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    // Filter out Netherlands
    const filteredCountries = data.filter(country => country.name.common !== "Netherlands");

    // Sort countries alphabetically
    filteredCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Populate country list
    filteredCountries.forEach(country => {
      const countryItem = document.createElement("div");
      countryItem.className = "country-item";
      countryItem.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
        <span>${country.name.common}</span>
      `;
      countryItem.addEventListener("click", () => selectCountry(country));
      countryList.appendChild(countryItem);
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Handle country selection
function selectCountry(country) {
  // Remove active class from all items
  document.querySelectorAll(".country-item").forEach(item => {
    item.classList.remove("active");
  });

  // Add active class to the selected country
  const selectedItem = event.currentTarget;
  selectedItem.classList.add("active");

  // Store the selected country
  selectedCountry = country;

  // Show the "Continue" button
  continueButton.style.display = "block";
}

// Redirect to a new page
function redirectToPage(country) {
  if (country) {
    // Redirect to a new page with the selected country as a query parameter
    window.location.href = `selected-country.html?country=${encodeURIComponent(country.name.common || country)}`;
  } else {
    alert("Please select a country first.");
  }
}

// Toggle country list visibility
showCountriesButton.addEventListener("click", () => {
  countryList.classList.toggle("show");

  // Fetch countries only once when the list is shown for the first time
  if (countryList.children.length === 0) {
    fetchCountries();
  }
});

// Handle "FROM NETHERLANDS" button click
document.querySelector(".netherlands button").addEventListener("click", () => {
  redirectToPage("Netherlands");
});

// Handle "CONTINUE" button click
continueButton.querySelector("button").addEventListener("click", () => {
  redirectToPage(selectedCountry);
});
const backgroundImage = document.getElementById("backgroundImage");

// List of image file paths
const imageFiles = [
  "images/images1.jpg",
  "images/images2.jpg",
  "images/images.jpg",
  "images/image4.jpg"
];

let currentImageIndex = 0;

// Function to change the background image
function changeBackgroundImage() {
  // Set the next image source
  backgroundImage.src = imageFiles[currentImageIndex];

  // Add the 'active' class to fade in the image
  backgroundImage.classList.add("active");

  // Update the index for the next image
  currentImageIndex = (currentImageIndex + 1) % imageFiles.length;

  // Remove the 'active' class after the transition ends
  setTimeout(() => {
    backgroundImage.classList.remove("active");
  }, 1500); // Match the transition duration in CSS
}

// Load the first image
changeBackgroundImage();

// Change the image every 5 seconds
setInterval(changeBackgroundImage, 10000);