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
      const response = await ApiService.getTickets();
      const tickets = response.data;

      if (tickets.length > 0) {
        this.ticket = tickets[tickets.length - 1];
        const date = new Date(this.ticket.fecha);
        this.ticket.fecha = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error al obtener los tickets:', error);
    }
  },
  mounted() {
    if (this.ticket) {
      window.print();
    }
    setTimeout(() => {
      this.$router.replace('/');
    }, 10000)
  },
  methods: {
    volver() {
      this.$router.push('/');
    }
  }
}
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo-principal">Municipalidad de JAEN</h1>
    <div class="ticket-card">
      <h2 class="titulo-ticket">Ticket Generado</h2>
      <div v-if="ticket" class="ticket-info">
        <h3 class="area-nombre">Área: {{ ticket.areaNombre }}</h3>
        <p class="nombre-cliente">{{ ticket.nombres }} {{ ticket.apePaterno }} {{ ticket.apeMaterno }}</p>
        <div class="numero-ticket">
          <span class="etiqueta">Número de Ticket:</span>
          <span class="valor">{{ ticket.numeroTicket }}</span>
        </div>
        <div class="fecha-ticket">
          <span class="etiqueta">Fecha:</span>
          <span class="valor">{{ ticket.fecha }}</span>
        </div>
      </div>
      <p v-else class="sin-ticket">No hay ticket generado.</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
.contenedor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.titulo-principal {
  text-align: center;
  color: #0056b3;
  font-size: 28px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Estilos del ticket */
.ticket-card {
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.ticket-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(to right, #0056b3, #3498db);
}

.titulo-ticket {
  text-align: center;
  color: #0056b3;
  font-size: 24px;
  margin-top: 5px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px dashed #e0e0e0;
}

.ticket-info {
  padding: 10px 5px;
}

.area-nombre {
  color: #0056b3;
  font-size: 22px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(0, 86, 179, 0.1);
  border-radius: 6px;
  text-align: center;
}

.nombre-cliente {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
  text-align: center;
  font-weight: 500;
}

.numero-ticket, .fecha-ticket {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

.etiqueta {
  font-weight: bold;
  color: #555;
}

.valor {
  font-weight: 600;
  color: #0056b3;
}

.numero-ticket .valor {
  font-size: 22px;
  color: #e74c3c;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px dashed #e74c3c;
}

.sin-ticket {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px 0;
}
/* Estilos para impresión */
@media print {
  .boton-volver {
    display: none;
  }

  .ticket-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>