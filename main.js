// Getting DOM elements
const addFromSelect = document.getElementById("addFromSelect");
const shoppingCart = document.getElementById("shoppingCart");
const dishInput = document.getElementById("dishInput");
const submitOrderBtn = document.getElementById("submitOrder");
let currentOrder = JSON.parse(sessionStorage.getItem("order")) || [];



// Functions for the shopping cart and the order
const saveOrder = () => sessionStorage.setItem("order", JSON.stringify(currentOrder));

// Price map
const priceMap = {
  "המבורגר": 64,
  "פיצה": 66,
  "סושי": 50,
  "סופלה": 23,
  "גלידה": 18,
  "מלבי": 20,
};


const renderCart = () => {
    if (!shoppingCart) return;
    const tbody = shoppingCart.querySelector("tbody");
    if(!tbody) return;

    tbody.innerHTML="";
    let totalPrice = 0;
      
    currentOrder.forEach(dish => {
      const tr = document.createElement("tr");
      const dishTotal = dish.price * dish.quantity;
      tr.innerHTML = `
      <td>${dish.name}</td>
      <td>${dish.quantity}</td>
      <td>${dishTotal}</td>
      `;
      tbody.append(tr);
      totalPrice += dishTotal;
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
    <td colspan="2">סכום ביניים</td>
    <td>${totalPrice}</td>
    `;
    tbody.append(totalRow);

    const deliveryTax = totalPrice/10;
    const deliveryRow = document.createElement("tr");
    deliveryRow.innerHTML = `
    <td colspan="2">דמי משלוח (10%)</td>
    <td>${deliveryTax}</td>
    `;
    tbody.append(deliveryRow);

    const priceAndDelivery = totalPrice + deliveryTax;
    const priceAndDeliveryRow = document.createElement("tr");
    priceAndDeliveryRow.innerHTML = `
    <td colspan="2">סכום כולל</td>
    <td>${priceAndDelivery}</td>
    `;
    tbody.append(priceAndDeliveryRow);


};

const addDish = (dishName, dishPrice) => {
    if (!dishName) return;
    const existingDish = currentOrder.find(dish => dish.name === dishName);
    existingDish ? existingDish.quantity += 1: currentOrder.push({name: dishName, price: dishPrice, quantity: 1});
    saveOrder();
    renderCart();
};

document.querySelectorAll(".add").forEach(btn => {
    btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        const dishName = row.querySelector(".dish").textContent.trim();
        const dishPrice = parseInt(row.querySelector("td:nth-child(2)").textContent);
        addDish(dishName, dishPrice);
    })
});

document.addEventListener("DOMContentLoaded", renderCart);

if (addFromSelect) {
  addFromSelect.addEventListener("submit", (event) => {
    event.preventDefault();
    const dishName = (dishInput?.value || "").trim();
    const dishPrice = priceMap[dishName] ?? 0;
    if (dishName) {
      addDish(dishName, dishPrice);
      addFromSelect.reset();
    }
  });
};

if (submitOrderBtn) {
  const minOrderMsg = document.getElementById("minOrderMsg");
  submitOrderBtn.addEventListener("click", () => {
    const subtotal = currentOrder.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    const delivery = subtotal > 0 ? subtotal / 10 : 0;
    const grandTotal = subtotal + delivery;
    
    if (minOrderMsg) minOrderMsg.textContent = "";

    if (grandTotal >= 50) {
      alert(`ההזמנה נשלחה! ההזמנה עלתה ${grandTotal} שקלים.`);
    currentOrder = [];
    saveOrder();
    renderCart();
    confetti({particleCount: 100, spread: 70, origin: { y: 0.6 },}); 
  } else {
    if (minOrderMsg) {
      minOrderMsg.textContent = "לא ניתן לבצע הזמנה מתחת ל-50 שקלים";
    }
  };
  });
};

// Sort by price
const sortBtn = document.getElementById("sortPrice");
let sortAscending = true;

if (sortBtn) {
sortBtn.addEventListener("click", () => {
  const table = document.getElementById("menu-table");
  const rows = Array.prototype.slice.call(table.querySelectorAll("tbody > tr"));

  rows.sort((rowA,rowB) => {
    let cellA = rowA.cells[1].textContent;
    let cellB = rowB.cells[1].textContent;  

    return sortAscending ? cellA - cellB : cellB - cellA;
  });
    rows.forEach(row => {
    table.querySelector("tbody").appendChild(row);
  });

  sortAscending = !sortAscending;
})};