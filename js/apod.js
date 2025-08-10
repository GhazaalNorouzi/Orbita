const API_KEY = "oofPHyggeLQkvoTI74mjjoSqS9UfEKR1k0nc0uml";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
const headerOfHome = document.querySelector("#headerOfHome");

async function getPicOfDay(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  console.log(data.url);

  if (data.media_type === "image") {
    // headerOfHome.style.backgroundImage = `url(${data.url})`;
  }
}

getPicOfDay(URL);

// ===================== last nasa img===========================
const apodContainer = document.getElementById("apodContainer");

async function getApodGallery() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 2); // سه روز اخیر

  const start = startDate.toISOString().split("T")[0];
  const end = today.toISOString().split("T")[0];

  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`
  );
  const data = await response.json();

  data.reverse().forEach((item) => {
    if (item.media_type === "image") {
      const card = document.createElement("div");
      // card.className = "col-md-4";
      card.classList.add("col-md-4", "card-wrapper");

      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${item.url}" class="card-img-top" alt="${item.title}">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <button class="btn btn-outline-primary w-100" onclick='showApodModal(${JSON.stringify(
              item
            ).replace(/'/g, "\\'")})'> See More</button>
          </div>
        </div>
      `;
      apodContainer.appendChild(card);
    }
  });
}

getApodGallery();

// modal
function showApodModal(item) {
  const modalTitle = document.getElementById("apodModalLabel");
  const modalImage = document.getElementById("modalImage");
  const modalDescription = document.getElementById("modalDescription");
  const modalDate = document.getElementById("modalDate");

  modalTitle.textContent = item.title;
  modalImage.src = item.url;
  modalImage.alt = item.title;
  modalDescription.textContent = item.explanation;
  modalDate.textContent = `تاریخ: ${item.date}`;

  // نمایش مودال
  const apodModal = new bootstrap.Modal(document.getElementById("apodModal"));
  apodModal.show();
}

// ------------------------------
