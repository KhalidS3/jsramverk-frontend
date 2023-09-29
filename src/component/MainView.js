import React, { useEffect, useState } from "react";
import TicketForm from "./TicketForm";
import TicketsList from "./TicketsList";
import CodeSelect from "./CodeSelect";

function MainView({ showMap, onShowMapToggle }) {
  const [delayedData, setDelayedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showsMap, setShowMap] = useState(true);

  useEffect(() => {
    fetch("https://jsramverk-trian-khsa16.azurewebsites.net/delayed")
      .then((response) => response.json())
      .then((result) => setDelayedData(result.data || []))
      .catch((error) => console.log(error));
  }, []);

  const [tickets, setTickets] = useState([]);
  const [reasonCodes, setReasonCodes] = useState([]);
  const [lastTicketId, setLastTicketId] = useState(0);

  useEffect(() => {
    fetch("https://jsramverk-trian-khsa16.azurewebsites.net/tickets")
      .then((response) => response.json())
      .then((result) => {
        setTickets(result.data); // Updating tickets state
        // Finding and setting the ID of the last ticket
        console.log("Fetched tickets:", result.data); // log the fetched data
        const lastId = result.data.length
          ? result.data[result.data.length - 1]._id
          : 0;
        console.log("Last ID:", lastId);
        setLastTicketId(lastId);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  const handleFormSubmit = (newTicket) => {
    fetch("https://jsramverk-trian-khsa16.azurewebsites.net/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTicket)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data); // log the server response

        // Adjust the data structure to ensure consistency
        // This step may vary based on the exact shape of your server response
        const newTicketWithId = {
          _id: data._id || data.data?._id, // Add other variations as needed
          ...newTicket,
          ...data.data // merge other properties from data.data if present
        };

        console.log("Adjusted New Ticket Data:", newTicketWithId); // log the adjusted new ticket data

        // Update tickets state with the new ticket that includes the _id
        setTickets((prevTickets) => {
          console.log("Previous Tickets:", prevTickets); // log previous tickets within setTickets
          const updatedTickets = [...prevTickets, newTicketWithId]; // Add the adjusted new ticket data
          console.log("Updated Tickets:", updatedTickets); // log updated tickets array
          return updatedTickets; // return updated tickets array to update state
        });
      })
      .catch((error) => console.error("Error:", error));
  };

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);
    return Math.floor(diff / (1000 * 60));
  };

  const handleItemClick = (item) => {
    onShowMapToggle(); // use the prop function to toggle showMap
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    onShowMapToggle();
    setSelectedItem(null);
  };

  const renderDelayedTable = (data) => (
    <div className="delayed-trains">
      {data.map((item) => {
        let locationElement = item.FromLocation &&
          item.FromLocation.length > 0 &&
          item.ToLocation &&
          item.ToLocation.length > 0 && (
            <h3>
              Train from {item.FromLocation[0].LocationName} to{" "}
              {item.ToLocation[0].LocationName}. Currently at{" "}
              {item.LocationSignature}.
            </h3>
          );

        return (
          <div
            onClick={() => handleItemClick(item)}
            key={item.id}
            className="train-container"
          >
            <div className="train-number">{item.OperationalTrainNumber}</div>
            <div className="current-station">{locationElement}</div>
            <div className="delay">{outputDelay(item)} minutes</div>
          </div>
        );
      })}
    </div>
  );
  const RenderTicketView = ({
    item,
    outputDelay,
    handleBackClick,
    newTicketId
  }) => {
    // Assuming newTicketId is passed as a prop or you have another way to retrieve or generate it
    console.log("items:", item);
    let fromLocation =
      item.FromLocation && item.FromLocation.length > 0
        ? item.FromLocation[0].LocationName
        : "";
    let toLocation =
      item.ToLocation && item.ToLocation.length > 0
        ? item.ToLocation[0].LocationName
        : "";
    let currentLocation = item.LocationSignature || "";

    return (
      <div className="ticket-container">
        <div className="ticket">
          <a href="#" onClick={handleBackClick}>
            &lt; Tillbaka
          </a>
          <h1>Nytt ärende #{newTicketId}</h1> {/* Adjusted here */}
          {fromLocation && toLocation && (
            <p>
              Tåg från {fromLocation} till {toLocation}. Just nu i{" "}
              {currentLocation}.
            </p>
          )}
          <p>
            <strong>Försenad:</strong> {outputDelay(item)} minuter
          </p>
        </div>
        <div className="old-tickets" id="old-tickets">
          <h2>Befintliga ärenden</h2>
        </div>
      </div>
    );
  };

  return (
    <div className="delayed" data-testid="delayed-trains">
      {showMap && <div id="map"></div>}
      {!showMap && selectedItem ? (
        <RenderTicketView
          item={selectedItem}
          outputDelay={outputDelay}
          handleBackClick={handleBackClick}
          newTicketId={lastTicketId + 1} // Incrementing last ticket ID for a new ticket
        />
      ) : (
        renderDelayedTable(delayedData)
      )}
      <CodeSelect onCodesFetch={setReasonCodes} />
      <TicketForm
        onFormSubmit={handleFormSubmit}
        reasonCodes={reasonCodes}
        lastTicketId={lastTicketId + 1} // Incrementing last ticket ID for the form
        selectedItem={selectedItem}
      />
      <TicketsList tickets={tickets} />
    </div>
  );
}

export default MainView;
