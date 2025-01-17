<script>
export default {
  name: "ViewTicket",
  data() {
    return {
      ticket: null
    };
  },
  created() {
    // Retrieve the generated ticket from localStorage
    const storedTicket = localStorage.getItem('generatedTicket');
    if (storedTicket) {
      this.ticket = JSON.parse(storedTicket);
    }
  }
}
</script>

<template>
  <h1>Municipalidad de JAEN</h1>
  <div>
    <h2>Ticket Generado</h2>
    <div v-if="ticket">
      <h3>Área: {{ ticket.area }}</h3>
      <p>Nombre: {{ ticket.persona }}</p>
      <p>Número de Ticket: {{ ticket.number }}</p>
      <p>Fecha: {{ ticket.date }}</p>
    </div>
    <p v-else>No hay ticket generado.</p>
  </div>
</template>

<style scoped>
div {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
}
</style>