document.addEventListener('DOMContentLoaded', function () {
  const searchInputEl = document.getElementById("searchInput");
  const searchResultsEl = document.getElementById("searchResults");
  const spinnerEl = document.getElementById("spinner");

  function createAndAppendSearchResult(result) {
    const { link, title, description } = result;

    const resultItemEl = document.createElement("div");
    resultItemEl.className = "result-item";

    const titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.className = "result-title";
    resultItemEl.appendChild(titleEl);

    resultItemEl.appendChild(document.createElement("br"));

    const urlEl = document.createElement("a");
    urlEl.className = "result-url";
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    resultItemEl.appendChild(urlEl);

    resultItemEl.appendChild(document.createElement("br"));

    const descriptionEl = document.createElement("p");
    descriptionEl.className = "link-description";
    descriptionEl.textContent = description || "";
    resultItemEl.appendChild(descriptionEl);

    searchResultsEl.appendChild(resultItemEl);
  }

  function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");
    searchResultsEl.textContent = "";

    if (!searchResults || searchResults.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No results found";
      p.className = "text-muted";
      searchResultsEl.appendChild(p);
      return;
    }

    for (const r of searchResults) {
      createAndAppendSearchResult(r);
    }
  }

  async function searchWikipedia(event) {
    if (event.key !== "Enter") return;

    const query = searchInputEl.value.trim();
    if (!query) return; // don't search empty

    spinnerEl.classList.remove("d-none");
    searchResultsEl.textContent = "";

    const url = `https://apis.ccbp.in/wiki-search?search=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      const { search_results } = jsonData;
      displayResults(search_results);
    } catch (err) {
      spinnerEl.classList.add("d-none");
      searchResultsEl.textContent = "";
      const errEl = document.createElement("p");
      errEl.textContent = "An error occurred while searching. See console for details.";
      errEl.className = "text-danger";
      searchResultsEl.appendChild(errEl);
      console.error("Fetch error:", err);
    }
  }

  searchInputEl.addEventListener("keydown", searchWikipedia);
});
