import React from 'react';
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import MainView from '../component/MainView';
import CodeSelect from '../component/CodeSelect';


describe('MainView Komponent', () => {
  it('renderar utan fel', () => {
    // Rendera MainView-komponenten
    const {getByTestId} = render(<MainView showMap={true}
      onShowMapToggle={() => {}}/>);

    // Hämta huvudkomponenten för MainView med hjälp av ett test-ID
    const mainViewComponent = getByTestId('delayed-trains');
    expect(mainViewComponent).toBeInTheDocument();

    // Hämta elementet för försenade tåg med hjälp av ett test-ID
    const delayedTrains = getByTestId('delayed-trains');
    expect(delayedTrains).toBeInTheDocument();

    // Kolla om kartan visas (baserat på data-show-map-attributet)
    if (mainViewComponent.getAttribute('data-show-map') === 'true') {
      // Hämta kartelementet med hjälp av ett test-ID om det visas
      const mapElement = getByTestId('map');
      expect(mapElement).toBeInTheDocument();
    }
  });
});

// Testfall för CodeSelect-komponenten
describe('CodeSelect Komponent', () => {
  it('renderar utan fel', () => {
    // Rendera CodeSelect-komponenten
    render(<CodeSelect onCodesFetch={() => {}}/>);
  });
});
