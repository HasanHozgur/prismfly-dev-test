document.addEventListener('DOMContentLoaded', () => {
  const desktopTabs = document.querySelectorAll('.collection-tab');
  const mobileSelect = document.getElementById('collection-tabs-select');

  const switchToCollection = (handle) => {
    // Create a clean URL without filter parameters
    const newUrl = `/collections/${handle}`;

    fetch(newUrl)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newTitle = doc.querySelector(
          '.collection-hero__title'
        )?.innerHTML;
        const newDescription = doc.querySelector(
          '.collection-hero__description'
        )?.innerHTML;
        const newProducts = doc.getElementById(
          'ProductGridContainer'
        )?.innerHTML;

        // Get new facets/filters container as well
        const newFilters = doc.getElementById(
          'main-collection-filters'
        )?.innerHTML;

        if (newTitle) {
          const titleTarget = document.querySelector('.collection-hero__title');
          if (titleTarget) titleTarget.innerHTML = newTitle;
        }

        if (newDescription) {
          const descTarget = document.querySelector(
            '.collection-hero__description'
          );
          if (descTarget) descTarget.innerHTML = newDescription;
        }

        if (newProducts) {
          document.getElementById('ProductGridContainer').innerHTML =
            newProducts;
        }

        // Update filters container
        if (newFilters) {
          const filtersContainer = document.getElementById(
            'main-collection-filters'
          );
          if (filtersContainer) filtersContainer.innerHTML = newFilters;
        }

        // Update active state for desktop
        desktopTabs.forEach((tab) => {
          tab.classList.toggle('active', tab.dataset.handle === handle);
        });

        // Sync mobile dropdown
        if (mobileSelect) {
          mobileSelect.value = handle;
        }

        // Clean URL update without any filter parameters
        window.history.pushState({}, '', newUrl);

        // Reinitialize any Shopify filter elements
        if (window.Shopify && window.Shopify.designMode) {
          document.dispatchEvent(new CustomEvent('shopify:section:load'));
        }
      });
  };

  // Desktop tabs
  desktopTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = tab.dataset.handle;
      switchToCollection(handle);
    });
  });

  // Mobile dropdown
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => {
      e.preventDefault();
      const handle = e.target.value;
      switchToCollection(handle);
    });

    // Prevent parent form from submitting
    const form = mobileSelect.closest('form');
    if (form) {
      form.addEventListener('submit', (e) => e.preventDefault());
    }
  }
});
