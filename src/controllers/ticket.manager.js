const TicketModel = require('../models/ticket.models.js');

class TicketManager {
  async createTicket(code, amount, purchaserId) {
    try {
      const newTicket = await TicketModel.create({ code, amount, purchaser: purchaserId });
      req.logger.info("Nuevo Ticket creado.")
      return newTicket;
    } catch (error) {
      req.logger.error('Error al crear el ticket:', error);
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await TicketModel.findById(ticketId).populate('purchaser');
      req.logger.info("Ticket encontrado por ID.")
      return ticket;
    } catch (error) {
      req.logger.error('Error al obtener el ticket por ID:', error);
      throw error;
    }
  }
}

module.exports = TicketManager;