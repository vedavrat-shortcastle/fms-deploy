import { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';

export const useLocationData = (
  selectedCountry: string,
  selectedState: string
) => {
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(states);
      // Reset city options if country changes
      setCityOptions([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      );
      setCityOptions(cities);
    }
  }, [selectedState]);

  return { countryOptions, stateOptions, cityOptions };
};
