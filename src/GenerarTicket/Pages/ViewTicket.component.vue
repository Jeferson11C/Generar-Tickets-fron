<script>
import ApiService from '../services/ticket-api.service';

export default {
  name: "ViewTicket",
  data() {
    return {
      ticket: null
    };
  },
  async created() {
    try {
      // Obtener todos los tickets
      const response = await ApiService.getTickets();
      const tickets = response.data;

      // Obtener el último ticket generado
      if (tickets.length > 0) {
        this.ticket = tickets[tickets.length - 1];
      }
    } catch (error) {
      console.error('Error al obtener los tickets:', error);
    }
  },
  methods: {
    volver() {
      this.$router.push('/');
    }
  }
}
</script>

<template>
  <h1>Municipalidad de JAEN</h1>
  <div>
    <h2>Ticket Generado</h2>
    <div v-if="ticket">
      <h3>Área: {{ ticket.areaNombre }}</h3>
      <p>Nombre: {{ ticket.nombres }} {{ ticket.apePaterno }} {{ ticket.apeMaterno }}</p>
      <p>Número de Ticket: {{ ticket.numeroTicket }}</p>
      <p>Fecha: {{ ticket.fecha }}</p>
      <p>Documento: {{ ticket.documento }}</p>
      <p>Estado: {{ ticket.estado }}</p>
    </div>
    <p v-else>No hay ticket generado.</p>
    <button @click="volver">Volver</button>
  </div>
</template>

<style scoped>
div {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
}

button {
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
}
</style>