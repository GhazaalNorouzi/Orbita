document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = document.querySelector(".form-control").value.trim();
  if (searchInput) {
    getPlanetGallery(searchInput);
  }
});
async function getPlanetGallery(planet) {
  const planetInfoEl = document.getElementById("planetInfo");
  const galleryEl = document.getElementById("planetGallery");

  const q = encodeURIComponent(planet);
  const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${q}`;
  const nasaUrl = `https://images-api.nasa.gov/search?q=${q}+planet&media_type=image`;

  try {
    const [wikiRes, nasaRes] = await Promise.all([
      fetch(wikiUrl),
      fetch(nasaUrl),
    ]);
    const wikiData = await wikiRes.json();
    const nasaData = await nasaRes.json();

    // توضیحات ویکی
    planetInfoEl.innerHTML = `
      <h2>${wikiData.title || planet}</h2>
      <p>${wikiData.extract || "اطلاعاتی موجود نیست."}</p>
      ${
        wikiData.content_urls?.desktop
          ? `<a href="${wikiData.content_urls.desktop.page}" target="_blank" class="btn btn-outline-primary btn-sm">بیشتر بدانید</a>`
          : ""
      }
    `;

    // داده‌های ناسا
    const items = nasaData.collection?.items || [];
    const planetLC = planet.toLowerCase();

    // فیلتر هوشمند (فقط عکس‌هایی که اسم سیاره توشون هست)
    const filteredItems = items
      .filter((it) => {
        const d = it.data?.[0] || {};
        const title = (d.title || "").toLowerCase();
        const desc = (d.description || "").toLowerCase();
        const keywords = (d.keywords || []).join(" ").toLowerCase();
        return (
          title.includes(planetLC) ||
          desc.includes(planetLC) ||
          keywords.includes(planetLC)
        );
      })
      .slice(0, 6); // فقط ۶ عکس اول

    // ساخت کارت‌ها
    galleryEl.innerHTML = "";
    filteredItems.forEach((item) => {
      const imgLink = item.links?.[0]?.href || "";
      galleryEl.innerHTML += `
        <div class="col-md-4 col-sm-6">
          <div class="card h-100 shadow-sm">
            <img src="${imgLink}" class="card-img-top" alt="${item.data[0].title}">
            <div class="card-body">
              <h5 class="card-title">${item.data[0].title}</h5>
            </div>
          </div>
        </div>
      `;
    });

    if (filteredItems.length === 0) {
      galleryEl.innerHTML = `<p class="text-muted">هیچ تصویر مرتبطی یافت نشد.</p>`;
    }
  } catch (err) {
    console.error(err);
    planetInfoEl.innerHTML = `<div class="alert alert-danger">خطا در دریافت اطلاعات.</div>`;
  }
}

// مثال استفاده
getPlanetGallery("Mars");
