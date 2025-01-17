<script>
import axios from 'axios';

export default {
  name: "GenerarTicket",
  data() {
    return {
      ticket: {
        area: '',
        number: '',
        date: ''
      },
      persona: null,
      dni: ''
    };
  },
  methods: {
    generarTicket() {
      // Retrieve the last ticket number from localStorage
      let lastTicketNumber = localStorage.getItem('lastTicketNumber');
      lastTicketNumber = lastTicketNumber ? parseInt(lastTicketNumber) : 0;

      // Increment the ticket number
      this.ticket.number = lastTicketNumber + 1;

      // Update the last ticket number in localStorage
      localStorage.setItem('lastTicketNumber', this.ticket.number);

      // Generate the current date
      this.ticket.date = new Date().toLocaleString();

      // Store the generated ticket in localStorage
      localStorage.setItem('generatedTicket', JSON.stringify({...this.ticket, persona: this.persona}));

      // Clear the form
      this.ticket.area = '';
      this.ticket.number = '';
      this.ticket.date = '';
      this.dni = '';
      this.persona = '';

      // Navigate to the view tickets page
      this.$router.push('/view-ticket');
    },
    async buscarPersona() {
      try {
        const response = await axios.post('https://apps.municieneguilla.gob.pe/node/api/xmldatospersonareniec', {
          documento: this.dni
        });
        console.log('Respuesta de la API:', response.data);
        if (response.data.ok) {
          this.persona = response.data.data.Nombres;
        } else {
          console.error('Error en la respuesta de la API:', response.data.message);
        }
      } catch (error) {
        console.error('Error al buscar persona:', error);
      }
    }
  }
}
</script>

<template>
  <h1>Municipalidad de JAEN</h1>
  <div>
    <h1>Generar Ticket</h1>
    <form @submit.prevent="generarTicket">
      <div>
        <label for="dni">DNI:</label>
        <input type="text" id="dni" v-model="dni" @blur="buscarPersona" required/>
      </div>
      <div v-if="persona">
        <p>Nombre: {{ persona }}</p>
      </div>
      <div>
        <label for="area">Área:</label>
        <input type="text" id="area" v-model="ticket.area" required/>
      </div>
      <pv-button type="submit">Generar Ticket :)</pv-button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

label {
  font-weight: bold;
}

input, textarea {
  padding: 0.5em;
  font-size: 1em;
}

button {
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
}
</style>