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

let totalDonation = 0;
const quantities = {};

const donationInput = document.getElementById("donationAmount");
const categorySliders = document.getElementById("category-sliders");
const summaryList = document.getElementById("summaryList");
const totalSpentEl = document.getElementById("totalSpent");
const remainingEl = document.getElementById("remaining");
const giveBtn = document.getElementById("giveBtn");

function updateSummary() {
  summaryList.innerHTML = "";
  let totalSpent = 0;
  categories.forEach(cat => {
    const qty = quantities[cat.name] || 0;
    if (qty > 0) {
      totalSpent += qty * cat.cost;
      const li = document.createElement("li");
      li.textContent = `${qty} x ${cat.name}`;
      summaryList.appendChild(li);
    }
  });
  totalSpentEl.textContent = totalSpent;
  const remaining = totalDonation - totalSpent;
  remainingEl.textContent = remaining;
  updateSliders(remaining);
}

function updateSliders(remainingBudget) {
  document.querySelectorAll(".category-slider").forEach(slider => {
    const name = slider.dataset.name;
    const cost = parseInt(slider.dataset.cost);
    slider.disabled = remainingBudget < cost && parseInt(slider.value) === 0;
    slider.parentElement.style.opacity = slider.disabled ? 0.4 : 1;
  });
}

donationInput.addEventListener("input", () => {
  totalDonation = parseInt(donationInput.value) || 0;
  document.getElementById("category-sliders").classList.remove("hidden");
  document.getElementById("summary").classList.remove("hidden");
  renderSliders();
  updateSummary();
});

function renderSliders() {
  categorySliders.innerHTML = "";
  categories.forEach(cat => {
    quantities[cat.name] = 0;
    const container = document.createElement("div");
    container.className = "category";

    const label = document.createElement("label");
    label.textContent = `${cat.name} ($${cat.cost})`;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 100;
    slider.value = 0;
    slider.className = "category-slider";
    slider.dataset.name = cat.name;
    slider.dataset.cost = cat.cost;

    const count = document.createElement("span");
    count.textContent = "0";
    count.className = "bundle-count";

    slider.addEventListener("input", () => {
      const quantity = parseInt(slider.value);
      const currentTotal = Object.entries(quantities).reduce((sum, [name, qty]) => {
        const category = categories.find(c => c.name === name);
        return sum + qty * category.cost;
      }, 0);
      const newTotal = currentTotal - quantities[cat.name] * cat.cost + quantity * cat.cost;
      if (newTotal <= totalDonation) {
        quantities[cat.name] = quantity;
        count.textContent = quantity;
        updateSummary();
      } else {
        slider.value = quantities[cat.name];
      }
    });

    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(count);
    categorySliders.appendChild(container);
  });
}

giveBtn.addEventListener("click", () => {
  const summaryText = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([name, qty]) => `${qty} x ${name}`)
    .join(", ");
  const donationURL = `https://www.qgiv.com/donate/?summary=${encodeURIComponent(summaryText)}`;
  window.location.href = donationURL;
});
