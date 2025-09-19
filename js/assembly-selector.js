// Assembly Selection functionality
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

// Estado inicial: sin ninguna asamblea seleccionada
document.addEventListener('DOMContentLoaded', function () {
    // console.log('Selector de asambleas inicializado sin selección');

    // Auto seleccionar asamblea1 si la fecha actual es anterior al 21 de Octubre de 2025
    const currentDate = new Date();
    const cutoffDate = new Date('2025-10-21T00:00:00');
    if (currentDate < cutoffDate) {
        // Solo seleccionar automáticamente si no hay una selección manual previa
        const existingSelection = document.querySelector('.assembly-card.active');
        if (!existingSelection) {
            selectAssembly('asamblea1');
        }
    } else {
        // Solo seleccionar automáticamente si no hay una selección manual previa
        const existingSelection = document.querySelector('.assembly-card.active');
        if (!existingSelection) {
            selectAssembly('asamblea2');
        }
    }
});
