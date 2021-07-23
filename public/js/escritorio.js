//referencias html

const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams( window.location.search); //obtener el url

if( !searchParams.has('escritorio')){
    window.location = 'index.html'; // me regresa al index
    throw new Error(' El escritorio es obligatorio'); 
}

divAlerta.style.display = 'none';


const escritorio = searchParams.get('escritorio'); //obtener el parametro escritorio
lblEscritorio.innerText = escritorio;

//sockets


const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});



socket.on('ultimo-ticket', (ultimoTicke)=>{
    
})

btnAtender.addEventListener( 'click', () => {

    socket.emit( 'atender-ticket', { escritorio }, ({ok,ticket})=>{
        if(!ok){
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;
        

    })
  
});

socket.on('tickets-pendientes',(cola)=>{
    if (cola ===0){
        lblPendientes.style.display = 'none';    
    }
    else{
        
        lblPendientes.style.display = '';    
        divAlerta.style.display = 'none';
        lblPendientes.innerText = cola;
    }
})
