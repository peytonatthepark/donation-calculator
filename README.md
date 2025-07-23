# 🌟 Church at the Park – Donation Calculator

This interactive tool helps donors visualize the potential impact of their gift — from hygiene kits to safe parking and housing support — created to empower generosity with transparency.

> 💛 Built with love during a 2025 internship at Church at the Park. Designed to be easy to use, easy to edit, and easy to maintain by future team members.

---

## 🌐 Live Calculator Link

Once published through GitHub Pages, this calculator is accessible here: https://github.com/peytonatthepark/donation-calculator


To find your actual live link:
- Go to your repo → **Settings → Pages**
- Look under "Your site is live at…"

---

## 📁 What's Inside This Project

| File / Folder     | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `index.html`      | Main webpage structure                                                      |
| `style.css`       | Styling, colors, layout                                                     |
| `script.js`       | Calculator logic + bundle system + Qgiv redirect                           |
| `images/`         | Logo and background image files                                             |
| `favicon.png`     | The icon shown in the browser tab                                           |

---

## 🖥️ How to Open and Edit (For Non-Technical Users)

1. Go to the GitHub repository.
2. Click the green **Code** button → `Download ZIP`.
3. Unzip the folder on your computer.
4. Double-click `index.html` to preview the calculator.
5. Right-click any file (like `script.js`) and open in **Notepad** or **VS Code** to edit.

---

## ✏️ How to Edit Donation Items

Open `script.js` and scroll to the top:

```js
const items = [
  { name: "Canned Goods", category: "Feed Hope", cost: 10 },
  { name: "Meal Packs", category: "Feed Hope", cost: 15 },
  ...
];

//please refer to the word document for the rest of the instructions, thank you. 
