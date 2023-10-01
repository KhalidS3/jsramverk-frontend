import React, {useEffect, useState} from 'react';

function TicketForm({onFormSubmit, reasonCodes, lastTicketId, selectedItem}) {
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedTrainnumber, setSelectedTrainnumber] = useState('');
  const [selectedTraindate, setSelectedTraindate] = useState('');
  const [newTicketId, setNewTicketId] = useState(lastTicketId + 1);

  useEffect(() => {
    if (reasonCodes && reasonCodes.length > 0) {
      setSelectedCode(reasonCodes[0].Code); // Set the first code as default
    }
  }, [reasonCodes]);

  useEffect(() => {
    if (selectedItem) {
      console.log('Selected Item:', selectedItem);
      setSelectedTrainnumber(selectedItem.OperationalTrainNumber);
      console.log('Set Train Number:', selectedItem.OperationalTrainNumber);
      setSelectedTraindate(selectedItem.EstimatedTimeAtLocation.substring(0, 10));
    }
  }, [selectedItem]);

  useEffect(() => {
    console.log('Selected Code:', selectedCode); // Log selectedCode whenever it changes
  }, [selectedCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCode || !selectedTrainnumber || !selectedTraindate) {
      // Add validation check
      console.error('All fields are required!');
      return;
    }
    console.log({
      _id: newTicketId,
      code: selectedCode,
      trainnumber: selectedTrainnumber,
      traindate: selectedTraindate,
    });
    onFormSubmit({
      code: selectedCode,
      trainnumber: selectedTrainnumber,
      traindate: selectedTraindate,
    });
    setNewTicketId(newTicketId + 1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Orsakskod
        <select
          value={selectedCode}
          onChange={(e) => {
            const selectedValue = e.target.value;
            console.log('e.target.value:', selectedValue);
            setSelectedCode(selectedValue);
          }}
        >
          {reasonCodes && reasonCodes.map((code) => ( // Safely mapping over reasonCodes
            <option key={code.Code} value={code.Code}>
              {code.Code} - {code.Level3Description}
            </option>
          ))}
        </select>
      </label>
      <div>
        <input
          type="text"
          value={selectedTrainnumber}
          readOnly={true}
          style={{display: 'none'}}
        />
      </div>
      <div>
        <input
          type="date"
          value={selectedTraindate}
          readOnly={true}
          style={{display: 'none'}}
        />
      </div>
      <button type="submit" disabled={!selectedCode || !selectedTrainnumber || !selectedTraindate}>
        Skapa nytt ärende
      </button>
    </form>
  );
}

export default TicketForm;
