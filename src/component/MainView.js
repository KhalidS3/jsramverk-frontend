import React, {useEffect, useState} from 'react';
import TicketForm from './TicketForm';
import TicketsList from './TicketsList';
import CodeSelect from './CodeSelect';
import PropTypes from 'prop-types';

/**
 * Main view component for the application.
 *
 * @param {boolean} showMap - Indicates whether to show the map.
 * @param {function} onShowMapToggle - Function to toggle the map.
 * @return {Component} The component of the ticket from.
 */
function MainView({showMap, onShowMapToggle}) {
  const [delayedData, setDelayedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [showsMap, setShowMap] = useState(true);

  useEffect(() => {
    fetch('https://jsramverk-trian-khsa16.azurewebsites.net/delayed')
        .then((response) => response.json())
        .then((result) => setDelayedData(result.data || []))
        .catch((error) => console.log(error));
  }, []);

  const [tickets, setTickets] = useState([]);
  const [reasonCodes, setReasonCodes] = useState([]);
  const [lastTicketId, setLastTicketId] = useState(0);

  useEffect(() => {
    fetch('https://jsramverk-trian-khsa16.azurewebsites.net/tickets')
        .then((response) => response.json())
        .then((result) => {
          setTickets(result.data); // Updating tickets state
          // Finding and setting the ID of the last ticket
          console.log('Fetched tickets:', result.data); // log the fetched data
          const lastId = result.data.length ?
          result.data[result.data.length - 1]._id :
          0;
          console.log('Last ID:', lastId);
          setLastTicketId(lastId);
        })
        .catch((error) => console.error('Error fetching tickets:', error));
  }, []);

  const handleFormSubmit = (newTicket) => {
    fetch('https://jsramverk-trian-khsa16.azurewebsites.net/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTicket),
    })
        .then((response) => response.json())
        .then((data) => {
          console.log('Server Response:', data); // log the server response
          const newTicketWithId = {
            _id: data._id || data.data?.id,
            ...newTicket,
            ...data.data, // merging other properties from data.data if present
          };
          // log the adjusted new ticket data
          console.log('Adjusted New Ticket Data:', newTicketWithId);

          // Update tickets state with the new ticket that includes the _id
          setTickets((prevTickets) => {
            // log previous tickets within setTickets
            console.log('Previous Tickets:', prevTickets);
            // Add the adjusted new ticket data
            const updatedTickets = [...prevTickets, newTicketWithId];
            // log updated tickets array
            console.log('Updated Tickets:', updatedTickets);
            // return updated tickets array to update state
            return updatedTickets;
          });
          setLastTicketId(newTicketWithId._id);
        })
        .catch((error) => console.error('Error:', error));
  };

  const outputDelay = (item) => {
    const advertised = new Date(item.AdvertisedTimeAtLocation);
    const estimated = new Date(item.EstimatedTimeAtLocation);
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
        const locationElement = item.FromLocation &&
          item.FromLocation.length > 0 &&
          item.ToLocation &&
          item.ToLocation.length > 0 && (
          <h3>
              Train from {item.FromLocation[0].LocationName} to{' '}
            {item.ToLocation[0].LocationName}. Currently at{' '}
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
    newTicketId,
  }) => {
    // Assuming newTicketId is passed as a prop
    // or you have another way to retrieve or generate it
    console.log('items:', item);
    const fromLocation =
      item.FromLocation && item.FromLocation.length > 0 ?
        item.FromLocation[0].LocationName :
        '';
    const toLocation =
      item.ToLocation && item.ToLocation.length > 0 ?
        item.ToLocation[0].LocationName :
        '';
    const currentLocation = item.LocationSignature || '';

    return (
      <div className="ticket-container">
        <div className="ticket">
          <a href="#" onClick={handleBackClick}>
            &lt; Tillbaka
          </a>
          <h1>Nytt ärende #{newTicketId}</h1> {/* Adjusted here */}
          {fromLocation && toLocation && (
            <p>
              Tåg från {fromLocation} till {toLocation}. Just nu i{' '}
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

  // Protypes validation for porps used in RenderTicketView
  RenderTicketView.propTypes = {
    item: PropTypes.object.isRequired,
    outputDelay: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
    newTicketId: PropTypes.number.isRequired,
  };

  return (
    <div className="delayed" data-testid="delayed-trains">
      {showMap && <div id="map"></div>}
      {!showMap && selectedItem ? (
        <RenderTicketView
          item={selectedItem}
          outputDelay={outputDelay}
          handleBackClick={handleBackClick}
          // Incrementing last ticket ID for a new ticket
          newTicketId={lastTicketId + 1}
        />
      ) : (
        renderDelayedTable(delayedData)
      )}
      <CodeSelect onCodesFetch={setReasonCodes} />
      <TicketForm
        onFormSubmit={handleFormSubmit}
        reasonCodes={reasonCodes}
        // Incrementing last ticket ID for the form
        lastTicketId={lastTicketId + 1}
        selectedItem={selectedItem}
      />
      <TicketsList tickets={tickets} />
    </div>
  );
}

MainView.propTypes = {
  showMap: PropTypes.bool.isRequired,
  onShowMapToggle: PropTypes.func.isRequired,
};

export default MainView;
