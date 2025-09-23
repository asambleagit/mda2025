// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
        item.querySelector(".fa-chevron-down").style.transform =
            "rotate(0deg)";
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add("active");
        element.querySelector(".fa-chevron-down").style.transform =
            "rotate(180deg)";
    }
}

function openFaqVoluntario(event) {
    event.preventDefault(); // evita que salte directo con el anchor

    const faq = document.getElementById("faq-voluntario");
    const questionBtn = document.getElementById("faq-question");

    // Hacer scroll suave hasta la sección
    faq.scrollIntoView({ behavior: "smooth" });

    // Abrir el toggle si aún no está abierto
    toggleFAQ(questionBtn);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

    const scrollBtn = document.getElementById("scrollBtn");
    const startSection = document.getElementById("startScroll");

    // Oculto el botón al inicio
    scrollBtn.style.display = "none";

    window.addEventListener("scroll", () => {
      const startPosition = startSection.offsetTop; // posición de la sección
      if (window.scrollY >= startPosition) {
        scrollBtn.style.display = "flex"; // mostrar
      } else {
        scrollBtn.style.display = "none"; // ocultar
      }
    });

     // Al hacer click, volver a la sección
      scrollBtn.addEventListener("click", () => {
        startSection.scrollIntoView({ behavior: "smooth" });
      });

    // ---- Load global event data from servicios.json ----
    async function loadGlobalEventData() {
        try {
            const response = await fetch('servicios.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            window.globalEventData = data;
            console.log('Global event data loaded successfully:', data.length, 'items');

            // Dispatch event to notify other components that data is loaded
            const event = new CustomEvent('dataLoaded');
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error loading global event data:', error);
            // Set empty array as fallback to prevent further errors
            window.globalEventData = [];
        }
    }

    // Load data immediately
    loadGlobalEventData();

    // ---- Smooth scrolling (desplazamiento suave al hacer click en un enlace con #) ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evitamos el comportamiento por defecto del enlace
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          // Desplazamiento suave hacia la sección objetivo
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // ---- Seleccionar una asamblea (tarjeta) ----
    function selectAssembly(assemblyId) {
      const wrapper = document.querySelector('.assembly-cards-wrapper');

      // Agregar clase para indicar que hay una selección activa
      wrapper.classList.add('has-selection');

      // Quitar clase 'active' y estilos de botón de todas las cards, pero mantener rounded-pill
      document.querySelectorAll('.assembly-card').forEach(card => {
        card.classList.remove('active', 'btn', 'btn-light');
        card.classList.add('rounded-pill'); // Always rounded
        card.style.backgroundColor = '';
        card.style.color = '';
        card.style.border = '';
      });

      // Marcar la card seleccionada como 'active' y aplicar estilos de botón
      const selectedCard = document.querySelector(`[data-assembly="${assemblyId}"]`);
      selectedCard.classList.add('active', 'btn', 'btn-light');
      selectedCard.style.backgroundColor = '#f8f9fa'; // Similar to btn-light
      selectedCard.style.color = '#212529';
      selectedCard.style.border = '1px solid #dee2e6';

      // Mensaje en consola (debug)
      console.log(`Asamblea seleccionada: ${assemblyId}`);

      // Disparar un evento personalizado para notificar a otros componentes
      const event = new CustomEvent('assemblyChanged', {
        detail: { assemblyId: assemblyId }
      });
      document.dispatchEvent(event);
    }

    // ---- Resetear selección (volver al estado inicial) ----
    function resetAssemblySelection() {
      const wrapper = document.querySelector('.assembly-cards-wrapper');
      wrapper.classList.remove('has-selection');

      // Quitar la clase 'active' de todas las cards
      document.querySelectorAll('.assembly-card').forEach(card => {
        card.classList.remove('active');
      });
    }

    // Estado inicial: sin ninguna asamblea seleccionada
    // console.log('Selector de asambleas inicializado sin selección');

    // Auto seleccionar asamblea1 si la fecha actual es anterior al 21 de Octubre de 2025
    const currentDate = new Date();
    const cutoffDate = new Date('2025-10-21T00:00:00');
    if (currentDate < cutoffDate) {
      selectAssembly('asamblea1');
    } else {
      selectAssembly('asamblea2');
    }

    // ---- Filtro por categoría de servicios ----
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', function () {
        if (!window.globalEventData || !Array.isArray(window.globalEventData)) {
          console.warn('Global event data not loaded yet');
          return;
        }

        // Quitar 'active' de todos los filtros y aplicar solo al seleccionado
        document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const parentFilter = this.dataset.filter; // Categoría seleccionada
        const localidadTab = document.querySelector(".filter-localidad-tab.active");
        const localidadFilter = localidadTab ? localidadTab.dataset.filter : "all";

        // Obtener la asamblea seleccionada
        const activeAssemblyCard = document.querySelector('.assembly-card.active');
        const currentAssembly = activeAssemblyCard ? activeAssemblyCard.dataset.assembly : null;

        try {
          // Mostrar todos los servicios si se selecciona "all"
          if (parentFilter === "all") {
            if (localidadFilter === "all") {
              // Mostrar todo si no hay filtros
              let filteredList = window.globalEventData;
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
            else {
              // Filtrar solo por localidad
              let filteredList = window.globalEventData.filter(x => x.localidad?.toLowerCase().includes(localidadFilter.toLowerCase()));
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
          }
          else {
            if (localidadFilter === "all") {
              // Filtrar solo por categoría
              let filteredList = window.globalEventData.filter(i => i.categoria === parentFilter);
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
            else {
              // Filtrar por localidad Y categoría
              let filteredList = window.globalEventData.filter(
                x =>
                  x.localidad?.toLowerCase().includes(localidadFilter.toLowerCase()) &&
                  x.categoria === parentFilter
              );
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
          }
        } catch (error) {
          console.error('Error filtering data:', error);
        }
      });
    });

    // ---- Filtro por localidad ----
    document.querySelectorAll('.filter-localidad-tab').forEach(btn => {
      btn.addEventListener('click', function () {
        if (!window.globalEventData || !Array.isArray(window.globalEventData)) {
          console.warn('Global event data not loaded yet');
          return;
        }

        // Quitar 'active' de todos los filtros de localidad y aplicar solo al seleccionado
        document.querySelectorAll('.filter-localidad-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterParentTab = document.querySelector(".filter-tab.active");
        const localidadFilter = this.dataset.filter; // Localidad seleccionada
        const parentFilter = filterParentTab ? filterParentTab.dataset.filter : "all"; // Categoría activa

        // Obtener la asamblea seleccionada
        const activeAssemblyCard = document.querySelector('.assembly-card.active');
        const currentAssembly = activeAssemblyCard ? activeAssemblyCard.dataset.assembly : null;

        try {
          if (parentFilter === "all") {
            if (localidadFilter === "all") {
              // Mostrar todo si no hay filtros
              let filteredList = window.globalEventData;
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
            else {
              // Filtrar solo por localidad
              let filteredList = window.globalEventData.filter(x => x.localidad?.toLowerCase().includes(localidadFilter.toLowerCase()));
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
          }
          else {
            if (localidadFilter === "all") {
              // Filtrar solo por categoría
              let filteredList = window.globalEventData.filter(i => i.categoria === parentFilter);
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
            else {
              // Filtrar por localidad Y categoría
              let filteredList = window.globalEventData.filter(
                x =>
                  x.localidad?.toLowerCase().includes(localidadFilter.toLowerCase()) &&
                  x.categoria === parentFilter
              );
              if (currentAssembly) {
                filteredList = filteredList.filter(item => {
                  if (currentAssembly === 'asamblea1') {
                    return item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea;
                  } else if (currentAssembly === 'asamblea2') {
                    return item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea;
                  }
                  return true;
                });
              }
              renderAmenities2(filteredList);
            }
          }
        } catch (error) {
          console.error('Error filtering data:', error);
        }
      });
    });

    // ---- Función para obtener icono según categoría ----
    function getIcon(categoria) {
      switch (categoria) {
        case 'farmacia': return 'fa-pills';
        case 'hotel': return 'fa-hotel';
        case 'restaurante': return 'fa-utensils';
        case 'centroSalud': return 'fa-hospital';
        case 'cajero': return 'fa-credit-card';
        default: return 'fa-home';
      }
    }

    // ---- Renderizado de servicios (amenities) ----
    function renderAmenities2(amenitiesData) {
      if (!amenitiesData) { return; }
      const container = document.getElementById("amenities-list");
      const activeAssemblyCard = document.querySelector('.assembly-card.active');
      const currentAssembly = activeAssemblyCard ? activeAssemblyCard.dataset.assembly : null;
      container.innerHTML = ""; // Limpiar la lista antes de renderizar
      amenitiesData.forEach((item) => {
        if (item.actions) {
          // (Opcional) Renderizar botones adicionales si el servicio tiene acciones definidas
          const actions = item.actions
            .map(
              (action) =>
                `<button class="btn btn-sm btn-outline-primary">${action.label}</button>`,
            )
            .join("");
        }
        // Plantilla HTML de cada servicio
        const html = `
           <div class="col-lg-${amenitiesData.length == 1 ? "12" : "6"} amenity-item-wrapper" data-category="${item.categoria}">
              <div class="amenity-card">
                  <div class="amenity-header">
                      <div class="amenity-icon">
                          <i class="fas ${getIcon(item.categoria)}"></i>
                      </div>
                      <div>
                          <h5 class="amenity-title">${item.titulo}</h5>
                      </div>
                  </div>
                  <p style="color: var(--calm-text-light); margin-bottom: 16px;">Elige alguna de las siguientes opciones para ver la información.</p>
                  <div class="amenity-actions">
                    ${item.categoria === 'hotel'
            ? (
              (currentAssembly === 'asamblea1' && item.link1)
                ? `<a href="${item.link1}" class="calm-btn-sm" target="_blank">Google Maps</a>`
                : (currentAssembly === 'asamblea2' && item.link2)
                  ? `<a href="${item.link2}" class="calm-btn-sm" target="_blank">Google Maps</a>`
                  : `<span>No existe información disponible, realiza la búsqueda en localidades cercanas</span>`
            )
            : (
              (item.link1 || item.link2)
                ? `
                                  ${item.link1 ? `<a href="${item.link1}" class="calm-btn-sm" target="_blank">Google Maps</a>` : ''}
                                  ${item.link2 ? `<a href="${item.link2}" class="calm-btn-sm" target="_blank">Sitio de la Municipalidad</a>` : ''}
                                `
                : `<span>No existe información disponible, realiza la búsqueda en localidades cercanas</span>`
            )
          }
                  </div>


              </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      });
    }

    // ---- Cuando los datos estén cargados ----
    document.addEventListener('dataLoaded', function () {
      if (!window.globalEventData || !Array.isArray(window.globalEventData)) {
        console.warn('Global event data not loaded yet for dataLoaded event');
        return;
      }
      // Renderizar los servicios iniciales
      renderAmenities2(window.globalEventData);
    });

    // ---- Manejar selección de asamblea y filtrar servicios ----
    document.addEventListener('assemblyChanged', function (e) {
      const selectedAssembly = e.detail.assemblyId;

      // Verificar que los datos estén cargados antes de filtrar
      if (!window.globalEventData || !Array.isArray(window.globalEventData)) {
        console.warn('Global event data not loaded yet for assembly change');
        return;
      }

      // Obtener los filtros activos actuales
      const categoryFilter = document.querySelector(".filter-tab.active")?.dataset.filter || "all";
      const localityFilter = document.querySelector(".filter-localidad-tab.active")?.dataset.filter || "all";

      try {
        let filteredList = window.globalEventData;

        // Filtrar por categoría si no es "all"
        if (categoryFilter !== "all") {
          filteredList = filteredList.filter(i => i.categoria === categoryFilter);
        }

        // Filtrar por localidad si no es "all"
        if (localityFilter !== "all") {
          filteredList = filteredList.filter(x => x.localidad?.toLowerCase().includes(localityFilter.toLowerCase()));
        }

        // Filtrar por asamblea
        if (selectedAssembly === 'asamblea1') {
          filteredList = filteredList.filter(item => item.asamblea === '1' || item.asamblea === 'both' || !item.asamblea);
        } else if (selectedAssembly === 'asamblea2') {
          filteredList = filteredList.filter(item => item.asamblea === '2' || item.asamblea === 'both' || !item.asamblea);
        }

        renderAmenities2(filteredList);
      } catch (error) {
        console.error('Error filtering data in assemblyChanged:', error);
      }
    });

    // ---- Inicializar selección de asamblea y disparar evento para filtrar servicios ----
    const currentDate2 = new Date();
    const cutoffDate2 = new Date('2025-10-21T00:00:00');
    let initialAssembly = 'asamblea1';
    if (currentDate2 >= cutoffDate2) {
      initialAssembly = 'asamblea2';
    }
    selectAssembly(initialAssembly);
    const event = new CustomEvent('assemblyChanged', { detail: { assemblyId: initialAssembly } });
    document.dispatchEvent(event);

    // ---- Carousel functionality ----
    const track = document.getElementById('chipTrack');
    const prevBtn = document.querySelector('.chip-prev');
    const nextBtn = document.querySelector('.chip-next');

    if (track && prevBtn && nextBtn) {
      function goNext() {
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      }
      function goPrev() {
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      }

      prevBtn.addEventListener('click', goPrev);
      nextBtn.addEventListener('click', goNext);
    }
});
