const categories = [
  {
    name: "Hygiene Kits",
    cost: 35,
    items: [
      "Shampoo", "Conditioner", "Body Wash", "Deodorant", "Razors", "Dental Care", "Feminine Hygiene"
    ]
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
  }
];

let donationAmount = 0;
let remaining = 0;
const categorySelections = {};

document.getElementById("donationAmount").addEventListener("input", (e) => {
  donationAmount = parseFloat(e.target.value) || 0;
  updateUI();
});

function updateUI() {
  remaining = donationAmount;
  const categoriesDiv = document.getElementById("categories");
  const bundleList = document.getElementById("bundleList");
  const remainingDisplay = document.getElementById("remaining");

  categoriesDiv.innerHTML = "";
  bundleList.innerHTML = "";

  categories.forEach((category) => {
    const maxBundles = Math.floor(remaining / category.cost);
    const currentQuantity = categorySelections[category.name] || 0;

    remaining -= currentQuantity * category.cost;

    // Create category container
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category-box");
    categoryBox.innerHTML = `
      <h3>${category.name} ($${category.cost} per bundle)</h3>
      <input 
        type="range" 
        min="0" 
        max="${Math.floor((donationAmount - totalUsedExcluding(category.name)) / category.cost)}" 
        value="${currentQuantity}" 
        step="1"
        id="slider-${category.name}"
      />
      <span>Quantity: <span id="qty-${category.name}">${currentQuantity}</span></span>
    `;

    const slider = categoryBox.querySelector(`#slider-${category.name}`);
    slider.addEventListener("input", (e) => {
      categorySelections[category.name] = parseInt(e.target.value);
      updateUI();
    });

    categoriesDiv.appendChild(categoryBox);
  });

  // Update summary
  Object.keys(categorySelections).forEach((catName) => {
    const qty = categorySelections[catName];
    if (qty > 0) {
      const category = categories.find(c => c.name === catName);
      const li = document.createElement("li");
      li.textContent = `${qty} × ${catName} ($${qty * category.cost})`;
      bundleList.appendChild(li);
    }
  });

  remainingDisplay.textContent = `$${Math.max(0, donationAmount - totalUsed()).toFixed(2)}`;
}

function totalUsed() {
  return Object.entries(categorySelections).reduce((sum, [name, qty]) => {
    const cat = categories.find(c => c.name === name);
    return sum + qty * cat.cost;
  }, 0);
}

function totalUsedExcluding(excludeCategory) {
  return Object.entries(categorySelections).reduce((sum, [name, qty]) => {
    if (name === excludeCategory) return sum;
    const cat = categories.find(c => c.name === name);
    return sum + qty * cat.cost;
  }, 0);
}

document.getElementById("giveButton").addEventListener("click", function () {
  const amount = donationAmount;
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid donation amount.");
    return;
  }

  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${amount}`;
  window.open(qgivUrl, "_blank");
});
