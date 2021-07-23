const TicketControl = require("../models/ticket-control");

const ticketcontrol = new TicketControl;

const socketController = (socket) => {


    socket.emit('ultimo-ticket', ticketcontrol.ultimoTicket);
    socket.emit('estado-actual', ticketcontrol.ultimos4);
    socket.emit('tickets-pendientes', ticketcontrol.tickets.length);
    
    
    socket.on( 'siguiente-ticket' , (payload, callback) =>{
        
        const siguiente = ticketcontrol.siguiente();
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);
        callback ( siguiente ); //envio de regreso al front el numero del ticket generado


    });

    socket.on('atender-ticket', ({escritorio},callback)=>{
        if(!escritorio){
            return callback({
                ok:false,
                msg: 'El escritorio es obligatorio'
            });
        }
        const ticket = ticketcontrol.atenderTicket( escritorio );
        socket.broadcast.emit('estado-actual', ticketcontrol.ultimos4); //le aviso cuando ya estoy atendiendo en otro escriotrio
        socket.emit('tickets-pendientes', ticketcontrol.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);
        if( !ticket ){
            callback({
                ok: false,
                msg: 'ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket
            })
        }
    });

}



module.exports = {
    socketController
}

