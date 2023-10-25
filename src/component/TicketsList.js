import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

/**
 * TicketsList component for displaying a list of tickets.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.tickets - Array of ticket objects.
 * @param {Object} props.onEditClick -  The component props event handler
 * for the onEditClick event
 * @return {JSX.Element} The TicketsList component.
 */
function TicketsList({tickets, onEditClick}) {
  useEffect(() => {
    console.log('Tickets Updated:', tickets);
  }, [tickets]);

  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket._id || ticket.id}>
          {ticket._id} - {ticket.code} - {ticket.trainnumber} -
          {ticket.traindate}
          <button onClick={() => onEditClick(ticket)}>Edit</button>
        </li>
      ))}
    </ul>
  );
}

// PropTypes validation
TicketsList.propTypes = {
  // Validate that 'tickets' is an array and is required
  tickets: PropTypes.array.isRequired,
  onEditClick: PropTypes.object.isRequired,
};

export default TicketsList;
