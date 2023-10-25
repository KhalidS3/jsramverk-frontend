import React, {useState} from 'react';
import PropTypes from 'prop-types';

/**
 * UpdateTicketForm component for updating existing tickets.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.ticketToUpdate - Ticket data to update.
 * @param {function} props.onUpdate - Callback for ticket update.
 * @param {Array} props.reasonCodes - List of reason codes.
 * @return {JSX.Element} The rendered component.
 */
function UpdateTicketForm({ticketToUpdate, onUpdate, reasonCodes}) {
  const [selectedCode, setSelectedCode] = useState(ticketToUpdate.code);
  const [trainNumber, setTrainNumber] = useState(ticketToUpdate.trainnumber);
  const [trainDate, setTrainDate] = useState(ticketToUpdate.traindate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      id: ticketToUpdate._id,
      code: selectedCode,
      trainnumber: trainNumber,
      traindate: trainDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
            Reason Code:
          <select value={selectedCode} onChange={(e) => setSelectedCode(
              e.target.value)}>
            {reasonCodes && reasonCodes.map((code) => (
              <option key={code.Code} value={code.Code}>
                {code.Code} - {code.Level3Description}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
            Train Number:
          <input
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
            Train Date:
          <input
            type="date"
            value={trainDate}
            onChange={(e) => setTrainDate(e.target.value)}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={!selectedCode || !trainNumber || !trainDate}
      >
            Update Ticket
      </button>
    </form>
  );
}

UpdateTicketForm.propTypes = {
  ticketToUpdate: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  reasonCodes: PropTypes.array.isRequired,
};

export default UpdateTicketForm;
