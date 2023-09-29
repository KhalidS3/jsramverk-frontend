import React, { useEffect, useState } from "react";

function TicketForm({ onFormSubmit, reasonCodes, lastTicketId, selectedItem }) {
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedTrainnumber, setSelectedTrainnumber] = useState("");
  const [selectedTraindate, setSelectedTraindate] = useState("");
  const [newTicketId, setNewTicketId] = useState(lastTicketId + 1);

  const handleTrainNumberChange = (e) => {
    setSelectedTrainnumber(e.target.value);
  };

  const handleTrainDateChange = (e) => {
    setSelectedTraindate(e.target.value);
  };

  // Update selectedTrainnumber and selectedTraindate when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      console.log('Selected Item:', selectedItem);
      setSelectedTrainnumber(selectedItem.OperationalTrainNumber);
      console.log('Set Train Number:', selectedItem.OperationalTrainNumber); // Add this line
      setSelectedTraindate(selectedItem.EstimatedTimeAtLocation.substring(0, 10));
    }
  }, [selectedItem]);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Code:', selectedCode);
    console.log({
      _id: newTicketId,
      code: selectedCode,
      trainnumber: selectedTrainnumber,
      traindate: selectedTraindate
    });
    onFormSubmit({
      // _id: newTicketId,
      code: selectedCode,
      trainnumber: selectedTrainnumber,
      traindate: selectedTraindate
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
            console.log("e.target.value:", selectedValue);
            setSelectedCode(selectedValue);
          }}
        >
          {reasonCodes.map((code) => (
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
          onChange={handleTrainNumberChange}
          style={{ display: "none" }}
        />
      </div>
      <div>
        <input
          type="date"
          value={selectedTraindate}
          onChange={handleTrainDateChange}
          style={{ display: "none" }}
        />
      </div>
      <button type="submit">Skapa nytt ärende</button>
    </form>
  );
}

export default TicketForm;
