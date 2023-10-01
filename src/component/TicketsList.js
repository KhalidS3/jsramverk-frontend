import {useEffect} from 'react';

function TicketsList({tickets}) {
  useEffect(() => {
    console.log('Tickets Updated:', tickets);
  }, [tickets]);

  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket._id || ticket.id}>
          {ticket._id} - {ticket.code} - {ticket.trainnumber} -
          {ticket.traindate}
        </li>
      ))}
    </ul>
  );
}

export default TicketsList;
