import http from '../../shared/services/http-common';


export default {
    async getArea(id) {
        return http.get(`/api/area/${id}`);
    },
    async getAreas() {
        return http.get('/api/area');
    },
    async createArea(area) {
        return http.post('/api/area', area);
    },
    async createTicket(ticket) {
        try {
            return await http.post('/api/ticket', ticket);
        } catch (error) {
            console.error('Error creating ticket:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    async getTickets() {
        return http.get('/api/ticket');
    },
    async getTicket(id) {
        return http.get(`/api/ticket/${id}`);
    },
    async getTicketsByArea(areaNombre) {
        return http.get(`/api/ticket/area/${areaNombre}`);
    },
    async updateTicketStatus(id, status) {
        return http.put(`/api/ticket/${id}/status`, { status });
    }
};