<template>
  <div class="ticket-container">
    <div class="ticket-wrapper">
      <div class="header">
        <h1>Municipalidad de JAÉN</h1>
        <div class="header-underline"></div>
      </div>

      <div class="ticket-card">
        <div class="ticket-card-header">
          <h2>
            <i class="pi pi-check-circle"></i>
            Generar Ticket
          </h2>
        </div>

        <div class="ticket-form-content">
          <form @submit.prevent="generarTicket">
            <!-- DNI Field -->
            <div class="form-group">
              <label for="dni">DOCUMENTO</label>
              <input
                  id="dni"
                  v-model="dni"
                  type="tel"
                  inputmode="numeric"
                  placeholder="Ingrese su documento"
                  required
                  class="form-input"
                  pattern="\d{8}|\d{9}"
                  title="Debe ser un número de 8 o 9 dígitos"
                  @input="validateInput"
              />
              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </div>

            <!-- Area Selection -->
            <div class="form-group">
              <label for="area">Área</label>
              <select
                  id="area"
                  v-model="ticket.area"
                  class="form-input"
                  required
              >
                <option value="" disabled>Seleccione un área</option>
                <option
                    v-for="area in areas"
                    :key="area.id"
                    :value="area.nombre"
                >
                  {{ area.nombre }}
                </option>
              </select>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>Generar Ticket</span>
            </button>
          </form>
        </div>
      </div>

      <p class="footer-text">
        Sistema de Generación de Tickets © 2025 Municipalidad Provincial de Jaén - JSCC
      </p>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ticket-api.service';
import WebSocketService from '../services/websocket.service';

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
      tickets: [],
      errorMessage: '',
      isLoading: false
    };
  },
  async created() {
    try {
      const areasResponse = await ApiService.getAreas();
      this.areas = areasResponse.data.filter(area => area.nombre !== 'General');
      const ticketsResponse = await ApiService.getTickets();
      this.tickets = ticketsResponse.data;
      WebSocketService.setupWebSocketConnection(this.addNewArea);
    } catch (error) {
      console.error('Error al cargar áreas o tickets:', error);
    }
  },
  methods: {
    validateInput(event) {
      const value = event.target.value;
      event.target.value = value.replace(/\D/g, '');
    },
    async generarTicket() {
      if (!/^\d{8}$|^\d{9}$/.test(this.dni)) {
        this.errorMessage = "El DNI debe tener 8 dígitos o el carné de extranjería debe tener 9 dígitos";
        return;
      }

      this.isLoading = true;

      const requestData = {
        documento: this.dni,
        areaNombre: this.ticket.area
      };

      try {
        const response = await ApiService.createTicket(requestData);
        const newTicket = response.data;

        if (newTicket.mensaje === "DNI corresponde a un menor de edad") {
          this.errorMessage = "DNI corresponde a un menor de edad";
          console.info('generar_ticket.ticket.Domain.Services.PersonaService[0]', 'Respuesta de la API:', newTicket);
          console.error('generar_ticket.ticket.Domain.Services.PersonaService[0]', 'Error en la respuesta de la API: DNI corresponde a un menor de edad');
          this.isLoading = false;
          return;
        }

        this.ticket.id = newTicket.id;
        this.ticket.numeroTicket = newTicket.numeroTicket;
        this.ticket.area = newTicket.area;
        this.ticket.date = newTicket.fecha;
        this.ticket.nombres = newTicket.nombres;
        this.ticket.apePaterno = newTicket.apePaterno;
        this.ticket.apeMaterno = newTicket.apeMaterno;
        this.ticket.estado = newTicket.estado;

        console.log('Ticket creado exitosamente');

        WebSocketService.sendMessage({action: 'ticketCreated', ticket: newTicket});

        this.$router.push('/view-ticket');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = "Error al crear el ticket: DNI no encontrado";
        } else {
          this.errorMessage = "Error al crear el ticket: " + error.message;
        }
        console.error('Error al crear el ticket:', error);
      } finally {
        this.isLoading = false;
      }

      this.ticket.area = '';
      this.ticket.number = '';
      this.ticket.date = '';
      this.ticket.nombres = '';
      this.ticket.apePaterno = '';
      this.ticket.apeMaterno = '';
      this.dni = '';
      this.persona = '';
    },
    addNewArea(newArea) {
      this.areas.push(newArea);
    }
  }
};
</script>

<style scoped>
.ticket-container {
  min-height: 80vh;
  background-color: #f4f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-wrapper {
  width: 100%;
  max-width: 500px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.header-underline {
  height: 4px;
  width: 100px;
  background-color: #3498db;
  margin: 0 auto;
  border-radius: 10px;
}

.ticket-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ticket-card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 20px;
}

.ticket-card-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  margin: 0;
}

.ticket-card-header i {
  color: #3498db;
}

.ticket-form-content {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.error-message {
  color: #e74c3c;
  margin-top: 8px;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn i {
  font-size: 1.2rem;
}

.footer-text {
  text-align: center;
  color: #6c757d;
  margin-top: 20px;
  font-size: 0.8rem;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>