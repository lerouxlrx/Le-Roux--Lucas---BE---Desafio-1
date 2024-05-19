const transport = require("../config/nodemailer");

class EmailManager {
    async buyTicket(ticket, userEmail) {
        try {
            await transport.sendMail({
                from: "Teccomerce <lerouxlrx@gmail.com> ",
                to: userEmail,
                subject: "Ticket de compra Teccomerce", 
                html: `<h2>Ticket de Compra</h2>
                <p>Código de Ticket: ${ticket.code}</p>
                <p>Fecha de Compra: ${ticket.purchase_datetime}</p>
                <p>Monto Total: $${ticket.amount}</p>
                <p>Comprador: ${ticket.purchaser}</p>`,
            })
        } catch (error) {
            req.logger.error('Error en el proceso de enviar mail de compra.', error);
            res.status(500).json({ error: 'Error en el proceso de enviar mail de compra.' });
        }
    }

    async resetPassword(userEmail, token) {
        try {
            await transport.sendMail({
                from: "Teccomerce <lerouxlrx@gmail.com> ",
                to: userEmail,
                subject: "Reestablecer contraseña Teccomerce", 
                html: `<h2>Restablecer contraseña</h2>
                <p>Pediste restablecer tu contraseña, te pasamos el codigo.</p>
                <p>Si no lo hiciste, desestima este correo.</p>
                <strong>${token}</p>
                <p>Este codigo expira en una hora</p>
                <a href="http://localhost:8080/reset-password">Restablecer contraseña</a>`,
            })
        } catch (error) {
            req.logger.error('Error en el proceso de enviar mail de compra.', error);
            res.status(500).json({ error: 'Error en el proceso de enviar mail de compra.' });
        }
    }
}

module.exports = EmailManager