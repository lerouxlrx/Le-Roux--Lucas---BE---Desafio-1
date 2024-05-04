const TicketModel = require('../models/ticket.models.js');

class TicketManager {
  async createTicket(code, amount, purchaserId) {
    try {
      const newTicket = await TicketModel.create({ code, amount, purchaser: purchaserId });
      return newTicket;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await TicketModel.findById(ticketId).populate('purchaser');
      return ticket;
    } catch (error) {
      console.error('Error al obtener el ticket por ID:', error);
      throw error;
    }
  }
}

module.exports = TicketManager;