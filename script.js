const items = [
  { name: "Sleeping Bag", category: "Outreach Supplies", cost: 20 },
  { name: "Tent", category: "Outreach Supplies", cost: 40 },
  { name: "Blanket", category: "Outreach Supplies", cost: 10 },
  { name: "Pillow", category: "Outreach Supplies", cost: 8 },
  { name: "Tarp", category: "Outreach Supplies", cost: 12 },

  { name: "Shampoo", category: "Hygiene Kits", cost: 5 },
  { name: "Conditioner", category: "Hygiene Kits", cost: 5 },
  { name: "Body Wash", category: "Hygiene Kits", cost: 5 },
  { name: "Deodorant", category: "Hygiene Kits", cost: 4 },
  { name: "Razors", category: "Hygiene Kits", cost: 3 },
  { name: "Dental Care Products", category: "Hygiene Kits", cost: 6 },
  { name: "Feminine Hygiene Kit", category: "Hygiene Kits", cost: 7 },

  { name: "Dog Food", category: "Pet Supplies", cost: 12 },
  { name: "Cat Food", category: "Pet Supplies", cost: 10 },
  { name: "Cat Litter", category: "Pet Supplies", cost: 8 },

  { name: "Backpack", category: "Clothing & Accessories", cost: 15 },
  { name: "Purse", category: "Clothing & Accessories", cost: 10 },

  { name: "Canned Goods", category: "Non-Perishable Foods", cost: 10 },
  { name: "Meal Packs", category: "Non-Perishable Foods", cost: 10 },

  { name: "Secure Parking Spot", category: "Safe Parking", cost: 300 },
  { name: "Basic Amenities", category: "Safe Parking", cost: 100 },
  { name: "Safety Monitoring", category: "Safe Parking", cost: 100 },

  { name: "First Month Rent", category: "Move-in Costs", cost: 500 },
  { name: "Deposit", category: "Move-in Costs", cost: 300 },
  { name: "Utility Setup", category: "Move-in Costs", cost: 200 },

  { name: "Microwave", category: "Kitchen Essential Equipment", cost: 500 },
  { name: "Cookware", category: "Kitchen Essential Equipment", cost: 1000 },
  { name: "Utensils", category: "Kitchen Essential Equipment", cost: 500 },
  { name: "Dish Set", category: "Kitchen Essential Equipment", cost: 1000 },
  { name: "Small Appliances", category: "Kitchen Essential Equipment", cost: 2000 }
];

let donationAmount = 0;
let remaining = 0;
const selectedBundles = {};

document.getElementById("donationAmount").addEventListener("input", (e) => {
  donationAmount = parseFloat(e.target.value) || 0;
  remaining = donationAmount;
  for (const key in selectedBundles) {
    delete selectedBundles[key];
  }

  updateCalculator();
});

function updateCalculator() {
  const categoriesDiv = document.getElementById("categories");
  const bundleList = document.getElementById("bundleList");
  const remainingDisplay = document.getElementById("remaining");

  categoriesDiv.innerHTML = "";
  bundleList.innerHTML = "";
  remainingDisplay.textContent = `$${remaining.toFixed(2)}`;

  const categories = [...new Set(items.map(item => item.category))];

  categories.forEach(category => {
    const categoryItems = items.filter(item => item.category === category);
    const totalCost = categoryItems.reduce((sum, item) => sum + item.cost, 0);

    const button = document.createElement("button");
    button.classList.add("bundle-button");
    button.innerHTML = `${category}<br/>($${totalCost})`;

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = categoryItems.map(item => item.name).join("<br/>");
    button.appendChild(tooltip);

    if (totalCost > remaining) {
      button.classList.add("disabled");
    }

    button.addEventListener("click", () => {
      if (totalCost <= remaining) {
        if (selectedBundles[category]) {
          selectedBundles[category].count += 1;
        } else {
          selectedBundles[category] = { count: 1, cost: totalCost };
        }
        remaining -= totalCost;
        updateCalculator();
        }

    });

    categoriesDiv.appendChild(button);
  });

  for (const [category, data] of Object.entries(selectedBundles)) {
    const li = document.createElement("li");
    const totalCost = data.cost * data.count;
    li.textContent = `${category} Bundle x${data.count} - $${totalCost.toFixed(2)}`;
    bundleList.appendChild(li);
  }


  document.getElementById("giveButton").disabled = donationAmount === 0 || remaining === donationAmount;
}

document.getElementById('giveButton').addEventListener('click', function () {
  const amount = parseFloat(document.getElementById('donationAmount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid donation amount first.');
    return;
  }
  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${amount}`;
  window.open(qgivUrl, '_blank');
});
