// This data structure defines all available donation items.
// Grouped by category with cost; used to build the UI and calculate bundles.
const items = [
  
  // food button 
  { name: "Canned Goods", category: "Food Boxes", cost: 10 },
  { name: "Meal Packs", category: "Food Boxes", cost: 15 },

  //aplliction cover
  { name: "Applications Fees", category: "Housing Application Fees", cost: 50},
  // Daily Essentials (combined)
  
  { name: "Sleeping Bag", category: "Outreach Essentials", cost: 15 },
  { name: "Tent", category: "Outreach Essentials", cost: 25 },
  { name: "Blanket", category: "Outreach Essentials", cost: 15 },
  { name: "Pillow", category: "Outreach Essentials", cost: 15 },
  { name: "Tarp", category: "Outreach Essentials", cost: 15 },
  { name: "Backpack", category: "Outreach Essentials", cost: 15 },
  

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

// 🧼 Sanitize donation input to allow only digits
function sanitizeInput(input) {
  input.value = input.value.replace(/[^\d]/g, '');
}

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
    
  li.style.display = "flex";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";

  const totalCost = data.cost * data.count;

  // Bundle text
  const text = document.createElement("span");
  text.textContent = `${category} Bundle x${data.count} - $${totalCost.toFixed(2)}`;

  // Delete (X) button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.style.marginLeft = "12px";
  removeBtn.style.padding = "2px 8px";
  removeBtn.style.backgroundColor = "#EDEAE4"; // Soft beige tone
  removeBtn.style.border = "1px solid #aaa";
  removeBtn.style.borderRadius = "12px";
  removeBtn.style.color = "#453D36"; // Dark brown (your brand color)
  removeBtn.style.cursor = "pointer";
  removeBtn.style.fontSize = "0.85rem";
  removeBtn.style.fontFamily = "'Barlow Semi Condensed', sans-serif";
  removeBtn.style.transition = "all 0.2s ease";

  removeBtn.addEventListener("mouseover", () => {
    removeBtn.style.backgroundColor = "#d8d3cb";
  });

  removeBtn.addEventListener("mouseout", () => {
    removeBtn.style.backgroundColor = "#EDEAE4";
  });


  removeBtn.addEventListener("click", () => {
    // Remove 1 bundle
    if (selectedBundles[category].count > 1) {
      selectedBundles[category].count -= 1;
      remaining += selectedBundles[category].cost;
    } else {
      remaining += selectedBundles[category].cost;
      delete selectedBundles[category];
    }
    updateCalculator();
  });

  li.appendChild(text);
  li.appendChild(removeBtn);
  bundleList.appendChild(li);
}


  // Enable Give button only if a valid amount and at least one bundle selected
const giveButton = document.getElementById("giveButton");

// Update button label & state
if (donationAmount === 0) {
  giveButton.disabled = true;
  giveButton.textContent = "Give";//please chnage to quick giv way better experience 
  giveButton.style.opacity = "0.5";
} else if (remaining === donationAmount) {
  giveButton.disabled = false;
  giveButton.textContent = "Give";// same as give above 
  giveButton.style.opacity = "1";
} else {
  giveButton.disabled = false;
  giveButton.textContent = "Give";// dont chnage this give 
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

  // ⚠️ Update this URL when ready for production (currently test environment)// dont switch ?amount=$amount
  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${amount}`;
  
  //external link
  //window.open(qgivUrl, '_blank');
//interbal link
  window.location.href = qgivUrl;

  

});


document.getElementById("quickBundleBtn").addEventListener("click", () => {
  const essentialBundles = ["Food Boxes", "Housing Application Fees", "Outreach Essentials"];
  let totalQuickBundleCost = 0;

  // Step 1: Calculate total cost
  essentialBundles.forEach(category => {
    const itemsInCategory = items.filter(item => item.category === category);
    const bundleCost = itemsInCategory.reduce((sum, item) => sum + item.cost, 0);
    totalQuickBundleCost += bundleCost;
  });

  // Step 2: Set donation input value but DON'T trigger the input listener logic
  const donationInput = document.getElementById("donationAmount");
  donationInput.value = totalQuickBundleCost.toFixed(2);

  // Step 3: Manually update state variables
  donationAmount = totalQuickBundleCost;
  remaining = totalQuickBundleCost;
  for (const key in selectedBundles) {
    delete selectedBundles[key];
  }

  // Step 4: Add bundles if they fit
  essentialBundles.forEach(category => {
    const itemsInCategory = items.filter(item => item.category === category);
    const bundleCost = itemsInCategory.reduce((sum, item) => sum + item.cost, 0);

    if (bundleCost <= remaining) {
      selectedBundles[category] = {
        count: 1,
        cost: bundleCost
      };
      remaining -= bundleCost;
    }
  });

  // Step 5: Update UI
  updateCalculator();

  // Step 6: Scroll to Give button
  setTimeout(() => {
    const giveBtn = document.getElementById("giveButton");
    if (giveBtn) {
      giveBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      giveBtn.focus();
    }
  }, 100);
});

