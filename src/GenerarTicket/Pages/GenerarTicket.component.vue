<script>
import ApiService from '../services/ticket-api.service';

export default {
  data() {
    return {
      dni: '',
      persona: '',
      ticket: {
        area: '',
        number: '',
        date: '',
        nombres: '',
        apePaterno: '',
        apeMaterno: '',
        estado: 'En espera'
      },
      areas: [],
      tickets: []
    };
  },
  async created() {
    try {
      const areasResponse = await ApiService.getAreas();
      this.areas = areasResponse.data;
      const ticketsResponse = await ApiService.getTickets();
      this.tickets = ticketsResponse.data;
    } catch (error) {
      console.error('Error al cargar áreas o tickets:', error);
    }
  },
  methods: {
    async generarTicket() {
      const requestData = {
        documento: this.dni,
        areaNombre: this.ticket.area
      };

      try {
        const response = await ApiService.createTicket(requestData);
        const newTicket = response.data;

        this.ticket.id = newTicket.id;
        this.ticket.numeroTicket = newTicket.numeroTicket;
        this.ticket.area = newTicket.area;
        this.ticket.date = newTicket.fecha;
        this.ticket.nombres = newTicket.nombres;
        this.ticket.apePaterno = newTicket.apePaterno;
        this.ticket.apeMaterno = newTicket.apeMaterno;
        this.ticket.estado = newTicket.estado;

        console.log('Ticket creado exitosamente');
      } catch (error) {
        console.error('Error al crear el ticket:', error);
      }

      this.ticket.area = '';
      this.ticket.number = '';
      this.ticket.date = '';
      this.ticket.nombres = '';
      this.ticket.apePaterno = '';
      this.ticket.apeMaterno = '';
      this.dni = '';
      this.persona = '';

      this.$router.push('/view-ticket');
    }
  }
};
</script>

<template>
  <h1>Municipalidad de JAEN</h1>
  <div>
    <h1>Generar Ticket</h1>
    <form @submit.prevent="generarTicket">
      <div>
        <label for="dni">DNI:</label>
        <input type="text" id="dni" v-model="dni" required/>
      </div>
      <div>
        <label for="area">Área:</label>
        <select id="area" v-model="ticket.area" required>
          <option value="" disabled>Seleccione un área</option>
          <option v-for="area in areas" :key="area.id" :value="area.nombre">{{ area.nombre }}</option>
        </select>
      </div>
      <pv-button type="submit">
        <i class="pi pi-check-circle" style="font-size: 2.5rem"></i> Generar Ticket
      </pv-button>
    </form>
  </div>
</template>

<style scoped>
/* Container styles */
:root {
  --primary-color: #2563eb;
  --text-color: #1f2937;
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

/* Form layout */
form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Input groups */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Labels */
label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

/* Form controls */
input, select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  width: 100%;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Button styles */




:deep(.p-button i) {
  font-size: 1.25rem;
}

/* Title styles */
h1 {
  color: var(--text-color);
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  form {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>