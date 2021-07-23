const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero,escritorio){
        this.numero = numero;
        this.escritorio = escritorio;

    }
}




class TicketControl{
    constructor(){
        this.ultimoTicket = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = []; //los ultimos 4 tickets
        this.init();


    }

    get toJson(){
        return {
            ultimoticket: this.ultimoTicket,
            hoy: this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }
    }


    init(){
        const {hoy,tickets,ultimoticket,ultimos4}  = require('../DB/data.json');
        if (hoy === this.hoy){
            this.tickets = tickets;
            this.ultimoTicket = ultimoticket;
            this.ultimos4 = ultimos4;
        }else{
            this.guardarDB();
        } 
    }

    guardarDB(){
        const dbpath = path.join(__dirname, '../db/data.json' );
        fs.writeFileSync( dbpath, JSON.stringify( this.toJson)); // se está ocupando el getter y lo que hace es que en lugar de llamar 
        // this.tojson() como función, se llama this.tojson como si fuera una propiedad
    }

    siguiente(){
        this.ultimoTicket = this.ultimoTicket + 1;
        // console.log(this.ultimoTicket);
        const ticket = new Ticket(this.ultimoTicket, null);
        this.tickets.push(ticket);
        this.guardarDB();
        return 'Ticket ' + ticket.numero;

    }


    atenderTicket( escritorio ){
        if( this.tickets.length === 0 ){
            return null;
        }

        const ticket = this.tickets.shift(); //remueve el primer elemento del arreglo y lo retorna
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket );

        if( this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1);

        }

        this.guardarDB();
        
        return ticket;




    }



}
module.exports = TicketControl;