const items = [
  // Outreach Supplies
  { name: "Sleeping Bag", category: "Outreach Supplies", cost: 20 },
  { name: "Tent", category: "Outreach Supplies", cost: 40 },
  { name: "Blanket", category: "Outreach Supplies", cost: 10 },
  { name: "Pillow", category: "Outreach Supplies", cost: 8 },
  { name: "Tarp", category: "Outreach Supplies", cost: 12 },

  // Hygiene Kits
  { name: "Shampoo", category: "Hygiene Kits", cost: 5 },
  { name: "Conditioner", category: "Hygiene Kits", cost: 5 },
  { name: "Body Wash", category: "Hygiene Kits", cost: 5 },
  { name: "Deodorant", category: "Hygiene Kits", cost: 4 },
  { name: "Razors", category: "Hygiene Kits", cost: 3 },
  { name: "Dental Care Products", category: "Hygiene Kits", cost: 6 },
  { name: "Feminine Hygiene Kit", category: "Hygiene Kits", cost: 7 },

  // Baby Supplies
  { name: "Diapers", category: "Baby Supplies", cost: 10 },
  { name: "Wipes", category: "Baby Supplies", cost: 5 },
  { name: "Pull-Ups", category: "Baby Supplies", cost: 10 },

  // Pet Supplies
  { name: "Dog Food", category: "Pet Supplies", cost: 12 },
  { name: "Cat Food", category: "Pet Supplies", cost: 10 },
  { name: "Cat Litter", category: "Pet Supplies", cost: 8 },

  // Clothing & Accessories
  { name: "Backpack", category: "Clothing & Accessories", cost: 15 },
  { name: "Purse", category: "Clothing & Accessories", cost: 12 },
  { name: "Jacket", category: "Clothing & Accessories", cost: 20 },
  { name: "Pants", category: "Clothing & Accessories", cost: 15 },
  { name: "Shoes", category: "Clothing & Accessories", cost: 18 },
  { name: "Underwear", category: "Clothing & Accessories", cost: 6 },
  { name: "Socks", category: "Clothing & Accessories", cost: 4 },

  // Non-Perishable Foods
  { name: "Canned Food Pack", category: "Non-Perishable Foods", cost: 10 }
];


let donationAmount = 0;
let remaining = 0;
const selectedItems = [];

document.getElementById("donationAmount").addEventListener("input", (e) => {
  donationAmount = parseFloat(e.target.value) || 0;
  remaining = donationAmount;
  selectedItems.length = 0;
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
    const section = document.createElement("section");
    section.classList.add("category");
    section.innerHTML = `<h3>${category}</h3>`;

    items.filter(item => item.category === category).forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = `${item.name} ($${item.cost})`;
      btn.classList.add("item-button");

      if (item.cost > remaining) {
        btn.classList.add("disabled");
      }

      btn.addEventListener("click", () => {
        if (item.cost <= remaining) {
          selectedItems.push(item);
          remaining -= item.cost;
          updateCalculator();
        }
      });

      section.appendChild(btn);
    });

    categoriesDiv.appendChild(section);
  });

  selectedItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.cost}`;
    bundleList.appendChild(li);
  });

  document.getElementById("giveButton").disabled = donationAmount === 0 || remaining === donationAmount;

  document.getElementById('giveButton').addEventListener('click', function () {
  const donationInput = document.getElementById('donationAmount');
  const amount = parseFloat(donationInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid donation amount first.');
    return;
  }

  const qgivUrl = `https://secure.qgiv.com/for/churchatthepark-test/?amount=${amount}`;
  window.open(qgivUrl, '_blank');
});

}

