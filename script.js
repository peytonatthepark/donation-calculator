// This data structure defines all available donation items.
// Grouped by category with cost; used to build the UI and calculate bundles.
const items = [
  // Baby Supplies
  { name: "Diapers", category: "Baby Supplies", cost: 25 },
  { name: "Wipes", category: "Baby Supplies", cost: 15 },
  { name: "Pull-ups", category: "Baby Supplies", cost: 25 },
  
  // Hygiene & Pet Care
  { name: "Shampoo", category: "Hygiene & Pet Care", cost: 5 },
  { name: "Conditioner", category: "Hygiene & Pet Care", cost: 5 },
  { name: "Body Wash", category: "Hygiene & Pet Care", cost: 5 },
  { name: "Deodorant", category: "Hygiene & Pet Care", cost: 4 },
  { name: "Razors", category: "Hygiene & Pet Care", cost: 5 },
  { name: "Dental Care Products", category: "Hygiene & Pet Care", cost: 10 },
  { name: "Feminine Hygiene Kit", category: "Hygiene & Pet Care", cost: 20 },
  { name: "Dog Food", category: "Hygiene & Pet Care", cost: 12 },
  { name: "Cat Food", category: "Hygiene & Pet Care", cost: 12 },
  { name: "Cat Litter", category: "Hygiene & Pet Care", cost: 12 },

  // Daily Essentials
  { name: "Sleeping Bag", category: "Daily Essentials", cost: 20 },
  { name: "Tent", category: "Daily Essentials", cost: 40 },
  { name: "Blanket", category: "Daily Essentials", cost: 10 },
  { name: "Pillow", category: "Daily Essentials", cost: 8 },
  { name: "Tarp", category: "Daily Essentials", cost: 12 },
  { name: "Backpack", category: "Daily Essentials", cost: 15 },
  { name: "Purse", category: "Daily Essentials", cost: 10 },
  { name: "Canned Goods", category: "Daily Essentials", cost: 10 },
  { name: "Meal Packs", category: "Daily Essentials", cost: 10 },

  // Safe Parking
  { name: "Secure Parking Spot", category: "Safe Parking", cost: 300 },
  { name: "Basic Amenities", category: "Safe Parking", cost: 100 },
  { name: "Safety Monitoring", category: "Safe Parking", cost: 100 },

  // Move-In Costs
  { name: "First Month Rent", category: "Move-In Costs", cost: 500 },
  { name: "Deposit", category: "Move-In Costs", cost: 300 },
  { name: "Utility Setup", category: "Move-In Costs", cost: 200 },

  // Kitchen Essentials
  { name: "Microwave", category: "Kitchen Essentials", cost: 500 },
  { name: "Cookware", category: "Kitchen Essentials", cost: 1000 },
  { name: "Utensils", category: "Kitchen Essentials", cost: 500 },
  { name: "Dish Set", category: "Kitchen Essentials", cost: 1000 },
  { name: "Small Appliances", category: "Kitchen Essentials", cost: 2000 }
];

// Global state variables
let donationAmount = 0;
let remaining = 0;
const selectedBundles = {};

// Event listener: When user inputs donation amount, reset state and update UI
document.getElementById("donationAmount").addEventListener("input", (e) => {
  donationAmount = parseFloat(e.target.value) || 0;
  remaining = donationAmount;

  // Clear previous selections
  for (const key in selectedBundles) {
    delete selectedBundles[key];
  }

  updateCalculator();
});

// Main function that redraws the calculator UI based on current state
function updateCalculator() {
  const categoriesDiv = document.getElementById("categories");
  const bundleList = document.getElementById("bundleList");
  const remainingDisplay = document.getElementById("remaining");

  // Clear previous UI
  categoriesDiv.innerHTML = "";
  bundleList.innerHTML = "";
  remainingDisplay.textContent = `$${remaining.toFixed(2)}`;

  // Get unique category names
  const categories = [...new Set(items.map(item => item.category))];

  // Loop through categories to build buttons
  categories.forEach(category => {
    const categoryItems = items.filter(item => item.category === category);
    const totalCost = categoryItems.reduce((sum, item) => sum + item.cost, 0);

    // Create category bundle button
    const button = document.createElement("button");
    button.classList.add("bundle-button");
    button.innerHTML = `${category}<br/>($${totalCost})`;

    // Tooltip showing what's in each bundle
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = categoryItems.map(item => item.name).join("<br/>");
    button.appendChild(tooltip);

    // Disable button if not enough balance
    if (totalCost > remaining) {
      button.classList.add("disabled");
    }

    // Handle click: add bundle to selection
    button.addEventListener("click", () => {
      if (totalCost <= remaining) {
        if (selectedBundles[category]) {
          selectedBundles[category].count += 1;
        } else {
          selectedBundles[category] = { count: 1, cost: totalCost };
        }
        remaining -= totalCost;
        updateCalculator(); // Re-render everything
      }
    });

    categoriesDiv.appendChild(button);
  });

  // Display the selected bundles in the summary list
  for (const [category, data] of Object.entries(selectedBundles)) {
    const li = document.createElement("li");
    const totalCost = data.cost * data.count;
    li.textContent = `${category} Bundle x${data.count} - $${totalCost.toFixed(2)}`;
    bundleList.appendChild(li);
  }

  // Enable Give button only if a valid amount and at least one bundle selected
const giveButton = document.getElementById("giveButton");

// Update button label & state
if (donationAmount === 0) {
  giveButton.disabled = true;
  giveButton.textContent = "Quick Give";
  giveButton.style.opacity = "0.5";
} else if (remaining === donationAmount) {
  giveButton.disabled = false;
  giveButton.textContent = "Quick Give";
  giveButton.style.opacity = "1";
} else {
  giveButton.disabled = false;
  giveButton.textContent = "Give";
  giveButton.style.opacity = "1";
}
}

//  Give Button: Redirects to Qgiv checkout with donation amount
document.getElementById('giveButton').addEventListener('click', function () {
  const amount = parseFloat(document.getElementById('donationAmount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid donation amount first.');
    return;
  }

  // ⚠️ Update this URL when ready for production (currently test environment)
  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${amount}`;
  window.open(qgivUrl, '_blank');
});
