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

let donationAmount = 0;
const selectedKits = new Array(categories.length).fill(0);

const donationInput = document.getElementById("donationAmount");
const categoriesSection = document.getElementById("categories");
const summarySection = document.getElementById("summary");
const summaryDetails = document.getElementById("summaryDetails");
const totalSpentEl = document.getElementById("totalSpent");
const remainingEl = document.getElementById("remaining");
const giveButton = document.getElementById("giveButton");

donationInput.addEventListener("input", () => {
  donationAmount = parseFloat(donationInput.value) || 0;
  renderCategories();
  updateSummary();
  categoriesSection.classList.remove("hidden");
  summarySection.classList.remove("hidden");
});

function renderCategories() {
  categoriesSection.innerHTML = "";

  categories.forEach((category, index) => {
    const maxBundles = Math.floor(
      (donationAmount - getTotalSpent() + selectedKits[index] * category.cost) / category.cost
    );

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category" + (maxBundles === 0 ? " faded" : "");

    const label = document.createElement("label");
    label.innerText = `${category.name} ($${category.cost} per kit)`;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = maxBundles;
    slider.value = selectedKits[index];
    slider.disabled = maxBundles === 0;

    const count = document.createElement("span");
    count.innerText = ` ${slider.value} kits`;

    slider.addEventListener("input", () => {
      selectedKits[index] = parseInt(slider.value);
      count.innerText = ` ${slider.value} kits`;
      renderCategories();
      updateSummary();
    });

    categoryDiv.appendChild(label);
    categoryDiv.appendChild(slider);
    categoryDiv.appendChild(count);
    categoriesSection.appendChild(categoryDiv);
  });
}

function getTotalSpent() {
  return selectedKits.reduce((total, count, index) => total + count * categories[index].cost, 0);
}

function updateSummary() {
  summaryDetails.innerHTML = "";

  categories.forEach((category, index) => {
    if (selectedKits[index] > 0) {
      const p = document.createElement("p");
      p.innerText = `${category.name}: ${selectedKits[index]} kits`;
      summaryDetails.appendChild(p);
    }
  });

  const spent = getTotalSpent();
  totalSpentEl.innerText = spent.toFixed(2);
  remainingEl.innerText = (donationAmount - spent).toFixed(2);
}

giveButton.addEventListener("click", () => {
  alert("Redirecting to Qgiv with your selection...");
  // Optionally construct URL params or localStorage logic
  window.location.href = "https://www.qgiv.com/donate/?form=mock";
});
