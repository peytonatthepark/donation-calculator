// --- Define Categories with Bundle Costs ---
const categories = [
  {
    name: "Hygiene Kits",
    cost: 35,
    items: ["Shampoo", "Conditioner", "Body Wash", "Deodorant", "Razors", "Dental Care", "Feminine Hygiene"]
  },
  {
    name: "Outreach Supplies",
    cost: 50,
    items: ["Sleeping Bag", "Tent", "Blanket", "Tarp", "Pillow"]
  },
  {
    name: "Pet Supplies",
    cost: 30,
    items: ["Dog Food", "Cat Food", "Cat Litter"]
  },
  {
    name: "Clothing & Accessories",
    cost: 25,
    items: ["Backpack", "Purse"]
  },
  {
    name: "Non-Perishable Foods",
    cost: 20,
    items: ["Canned Goods", "Meal Packs"]
  },
  {
    name: "Safe Parking",
    cost: 500,
    items: ["Secure Parking Spot", "Basic Amenities", "Safety Monitoring"]
  },
  {
    name: "Move-in Costs",
    cost: 1000,
    items: ["First Month Rent", "Deposit", "Utility Setup"]
  },
  {
    name: "Kitchen Essential Equipment",
    cost: 5000,
    items: ["Microwave", "Cookware", "Utensils", "Dish Set", "Small Appliances"]
  }
];

// --- Global State ---
let donationAmount = 0;
let categorySelections = {};

// --- Handle Donation Amount Input ---
document.getElementById("donationAmount").addEventListener("input", (e) => {
  donationAmount = parseFloat(e.target.value) || 0;
  updateUI();
});

// --- Core UI Update Function ---
function updateUI() {
  const categoriesDiv = document.getElementById("categories");
  const bundleList = document.getElementById("bundleList");
  const remainingDisplay = document.getElementById("remaining");

  categoriesDiv.innerHTML = "";
  bundleList.innerHTML = "";

  let usedTotal = totalUsed();

  categories.forEach((category) => {
    const safeId = category.name.replace(/\s+/g, '-');
    const selectedQty = categorySelections[category.name] || 0;

    const availableFunds = donationAmount - totalUsedExcluding(category.name);
    const maxBundles = Math.floor(availableFunds / category.cost);

    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category-box");
    categoryBox.innerHTML = `
      <h3>${category.name} <span style="font-weight: normal;">($${category.cost} per bundle)</span></h3>
      <input 
        type="range" 
        min="0" 
        max="${maxBundles}" 
        value="${selectedQty}" 
        step="1"
        id="slider-${safeId}"
      />
      <span> Quantity: <span id="qty-${safeId}">${selectedQty}</span></span>
    `;

    const slider = categoryBox.querySelector(`#slider-${safeId}`);
    const qtyLabel = categoryBox.querySelector(`#qty-${safeId}`);

    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      categorySelections[category.name] = val;
      qtyLabel.textContent = val;
      updateUI(); // Recalculate everything
    });

    categoriesDiv.appendChild(categoryBox);
  });

  // --- Update Bundle Summary ---
  Object.entries(categorySelections).forEach(([name, qty]) => {
    if (qty > 0) {
      const cat = categories.find(c => c.name === name);
      const li = document.createElement("li");
      li.textContent = `${qty} × ${name} ($${qty * cat.cost})`;
      bundleList.appendChild(li);
    }
  });

  // --- Update Remaining Balance ---
  const remaining = donationAmount - totalUsed();
  remainingDisplay.textContent = `$${Math.max(0, remaining).toFixed(2)}`;
}

// --- Total Used So Far ---
function totalUsed() {
  return Object.entries(categorySelections).reduce((sum, [name, qty]) => {
    const cat = categories.find(c => c.name === name);
    return sum + qty * cat.cost;
  }, 0);
}

// --- Total Used Excluding a Category (used for slider limits) ---
function totalUsedExcluding(excludeName) {
  return Object.entries(categorySelections).reduce((sum, [name, qty]) => {
    if (name === excludeName) return sum;
    const cat = categories.find(c => c.name === name);
    return sum + qty * cat.cost;
  }, 0);
}

// --- Give Button Click (redirect to Qgiv) ---
document.getElementById("giveButton").addEventListener("click", () => {
  if (donationAmount <= 0) {
    alert("Please enter a donation amount first.");
    return;
  }

  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${donationAmount}`;
  window.open(qgivUrl, "_blank");
});
