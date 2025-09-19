function ViewCards() {
    const viewMode = document.getElementById("View-mode").value;
    const cardsContainer = document.querySelector(".cards");
    const cardElements = document.querySelectorAll(".card");

    if (viewMode === "list-view") {
        cardsContainer.classList.add("list-view");
        cardsContainer.classList.remove("grid-view");

        cardElements.forEach(card => {
            card.classList.add("list-card");
            card.classList.remove("grid-card");
        });
    } else {
        cardsContainer.classList.add("grid-view");
        cardsContainer.classList.remove("list-view");

        cardElements.forEach(card => {
            card.classList.add("grid-card");
            card.classList.remove("list-card");
        });
    }
}

function filterCards() {
    const filter = document.getElementById("subject-filter").value;
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
    const subject = card.getAttribute("data-subject");
    if (filter === "all" || subject === filter) {
        card.style.display = "block";
    }
    else {
        card.style.display = "none";
    }});
}

const cards = document.querySelectorAll('.card');
const pagination = document.getElementById('pagination');
if (cards.length >= 1) {
    pagination.style.display = 'block';
}

function openEditModal() {
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function confirmDelete() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเนื้อหานี้?")) {
        alert("ลบเรียบร้อยแล้ว");
    }
}

function toggleMenu(button) {
    const menu = button.nextElementSibling;
    
    document.querySelectorAll('.menu-options').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener('click', function (e) {
if (!e.target.closest('.card-menu')) {
    document.querySelectorAll('.menu-options').forEach(m => m.style.display = 'none');
}})