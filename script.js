let selectedCard = null;
let currentPrice = 18.0;

const cards = [
    {
        id: 1,
        units: 1,
        discount_percent: 10,
        name: "Standard",
        discounted_price: 10.00,
        original_price: 24.00,
        isPopular: false
    },
    {
        id: 2,
        units: 2,
        discount_percent: 20,
        name: "Most Popular",
        discounted_price: 18.00,
        original_price: 24.00,
        isPopular: true
    },
    {
        id: 3,
        units: 3,
        discount_percent: 30,
        name: "Premium",
        discounted_price: 24.00,
        original_price: 36.00,
        isPopular: false
    }
];

// Sizes and colors for dropdowns
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['Black', 'White', 'Gray', 'Navy', 'Red'];

// Function to create dropdown HTML
function createDropdown(type, index) {
    const options = type === 'size' ? sizes : colors;
    const optionsHtml = options.map(option => 
        `<option value="${option}" class="dropdown-options">${option}</option>`
    ).join('');
    
    return `
        <div class="dropdown" data-type="${type}${index}">
            <select class="dropdown-selected">
                ${optionsHtml}
            </select>
        </div>
    `;
}

// Function to create detail rows based on units
function createDetailRows(units) {
    let rows = '';
    for (let i = 1; i <= units; i++) {
        rows += `
            <div class="detail-row">
                <span class="detail-label">#${i}</span>
                ${createDropdown('size', i)}
                ${createDropdown('color', i)}
            </div>
        `;
    }
    return rows;
}

// Function to create a pricing card
function createPricingCard(card) {
    const isPopular = card.isPopular ? '<div class="popular-badge">MOST POPULAR</div>' : '';
    const cardClass = `pricing-card${card.isPopular ? ' most-popular' : ''}`;
    
    return `
        <div class="${cardClass}"
             data-units="${card.units}"
             data-price="${card.discounted_price.toFixed(2)}"
             data-original="${card.original_price.toFixed(2)}">
            ${isPopular}
            <div class="card-header ${card.isPopular ? 'mt-4' : ''}">
                <div class="radio-container">
                    <input type="radio" id="card-${card.id}" name="card" value="${card.name}" class="radio-button">
                    <div class="unit-info">
                        <span class="unit-count">${card.units} Unit${card.units > 1 ? 's' : ''}</span>
                        <span class="discount-badge">${card.discount_percent}% Off</span>
                    </div>
                </div>
                <div class="price-info">
                    <div class="current-price">$${card.discounted_price.toFixed(2)} USD</div>
                    <div class="original-price">$${card.original_price.toFixed(2)} USD</div>
                </div>
            </div>
            <div class="card-details">
                ${createDetailRows(card.units)}
            </div>
        </div>
    `;
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.pricing-cards');
    if (container) {
        container.innerHTML = cards.map(card => createPricingCard(card)).join('');
        
        // Initialize card selection
        const mostPopularCard = document.querySelector(".most-popular") || document.querySelector(".pricing-card");
        if (mostPopularCard) {
            selectCard(mostPopularCard);
        }
        
        // Add click event listeners to cards
        document.querySelectorAll(".pricing-card").forEach(card => {
            card.addEventListener("click", function (e) {
                // Don't do anything if clicking on dropdown or its children
                if (e.target.closest(".dropdown")) return;
                
                // Find and check the radio button inside this card
                const radio = this.querySelector('.radio-button');
                if (radio) {
                    radio.checked = true;
                }
                
                selectCard(this);
            });
        });
    }
});

// Card selection functionality
document.querySelectorAll(".pricing-card").forEach((card) => {
  card.addEventListener("click", function (e) {
    // Don't trigger card selection if clicking on dropdown
    if (e.target.closest(".dropdown")) return;

    selectCard(this);
  });
});

function selectCard(card) {
  // Remove previous selection
  if (selectedCard) {
    selectedCard.classList.remove("selected");
    selectedCard.querySelector(".radio-button").classList.remove("selected");
    selectedCard.querySelector(".card-details").classList.remove("expanded");
  }

  // Select new card
  selectedCard = card;
  card.classList.add("selected");
  card.querySelector(".radio-button").classList.add("selected");

  // Expand details if card has them
  const details = card.querySelector(".card-details");
  if (details) {
    details.classList.add("expanded");
  }

  // Update total price
  currentPrice = parseFloat(card.dataset.price);
  updateTotal();
}

function updateTotal() {
  document.querySelector(
    ".total-price"
  ).textContent = `Total: $${currentPrice.toFixed(2)} USD`;
}

// Dropdown functionality
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  const selected = dropdown.querySelector(".dropdown-selected");
  const options = dropdown.querySelectorAll(".dropdown-option");

  selected.addEventListener("click", function (e) {
    e.stopPropagation();

    // Close other dropdowns
    document.querySelectorAll(".dropdown").forEach((other) => {
      if (other !== dropdown) {
        other.classList.remove("open");
      }
    });

    // Toggle current dropdown
    dropdown.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();

      // Update selected value
      const selectedText = selected.querySelector("span:first-child");
      selectedText.textContent = this.textContent;

      // Close dropdown
      dropdown.classList.remove("open");
    });
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
    });
  }
});

// Add to cart functionality
document.querySelector(".add-to-cart").addEventListener("click", function () {
  // Create a nice animation effect
  this.style.transform = "scale(0.95)";
  setTimeout(() => {
    this.style.transform = "";

    // Show success message or handle cart addition
    alert(
      `Added ${
        selectedCard.dataset.units
      } unit(s) to cart for $${currentPrice.toFixed(2)} USD`
    );
  }, 150);
});

// Add some interactive micro-animations
document.querySelectorAll(".pricing-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.01)";
  });

  card.addEventListener("mouseleave", function () {
    if (!this.classList.contains("selected")) {
      this.style.transform = "";
    } else {
      this.style.transform = "scale(1.02)";
    }
  });
});
