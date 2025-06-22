document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkToggle");
  const html = document.documentElement;
  const loading = document.getElementById("loading");
  const countriesContainer = document.getElementById("countries");
  const searchInput = document.getElementById("search");
  const regionFilter = document.getElementById("regionFilter");

  if (localStorage.getItem("theme") === "dark") {
    html.setAttribute("data-theme", "dark");
  }

  toggleBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  let countriesData = [];

  const fetchCountries = async () => {
    loading.classList.remove("hidden");
    try {
      const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,borders,population,region,capital");
      const data = await res.json();
      countriesData = data;
      renderCountries(data);
    } catch (err) {
      countriesContainer.innerHTML = "<p class='text-error'>Xatolik yuz berdi. Qaytadan urinib ko‘ring.</p>";
    } finally {
      loading.classList.add("hidden");
    }
  };

  const showCountryModal = (country) => {
    const modal = document.createElement("dialog");
    modal.className = "modal modal-open";
    modal.innerHTML = `
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="font-bold text-lg mb-2">${country.name.common}</h3>
        <img src="${country.flags?.png}" alt="${country.name.common}" class="w-full h-48 object-cover rounded mb-4" />
        <p><strong>Capital:</strong> ${country.capital?.[0] || "Noma'lum"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Borders:</strong> ${(country.borders || []).join(", ") || "Yo'q"}</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Yopish</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("close", () => modal.remove());
    modal.showModal();
  };

  const renderCountries = (countries) => {
    countriesContainer.innerHTML = "";
    countries.forEach(country => {
      const card = document.createElement("div");
      card.className = "card bg-base-100 shadow-md cursor-pointer hover:scale-[1.02] transition";
      card.innerHTML = `
        <figure><img src="${country.flags?.png}" alt="${country.name.common}" class="h-40 w-full object-cover" /></figure>
        <div class="card-body">
          <h2 class="card-title">${country.name.common}</h2>
          <p><strong>Capital:</strong> ${country.capital?.[0] || "Noma'lum"}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        </div>
      `;
      card.addEventListener("click", () => showCountryModal(country));
      countriesContainer.appendChild(card);
    });
  };

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = countriesData.filter(c =>
      c.name.common.toLowerCase().includes(query)
    );
    renderCountries(filtered);
  });

  regionFilter.addEventListener("change", () => {
    const region = regionFilter.value;
    const filtered = countriesData.filter(c =>
      c.region === region
    );
    renderCountries(filtered);
  });

  fetchCountries();
});
