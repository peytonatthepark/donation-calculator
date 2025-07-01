const items = [
  { name: "Sleeping Bag", category: "Outreach Supplies", cost: 20 },
  { name: "Tent", category: "Outreach Supplies", cost: 40 },
  { name: "Blanket", category: "Outreach Supplies", cost: 10 },
  { name: "Shampoo", category: "Hygiene Kits", cost: 5 },
  { name: "Feminine Hygiene Kit", category: "Hygiene Kits", cost: 7 },
  { name: "Dog Food", category: "Pet Supplies", cost: 12 },
  { name: "Cat Litter", category: "Pet Supplies", cost: 8 },
  { name: "Backpack", category: "Clothing & Accessories", cost: 15 },
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

