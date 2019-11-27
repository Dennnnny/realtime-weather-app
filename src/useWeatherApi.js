import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = locationName => {
  // 這邊加上return
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-C495CD1E-B320-4451-B447-5C1E09FAF1F6&locationName=${locationName}`
  )
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      const locationData = data.records.location[0];
      // console.log(locationData);
      const weatherElement = locationData.weatherElement.reduce(
        (neededElement, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElement[item.elementName] = item.elementValue;
          }
          return neededElement;
        },
        {}
      );
      // 這邊改成 return 資料 而不是setWeatherElement
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,

        temperature: weatherElement.TEMP,
        windSpeed: weatherElement.WDSD,
        humid: weatherElement.HUMD
      };
    });
};

const fetchWeatherForcast = cityName => {
  // 加上return
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-C495CD1E-B320-4451-B447-5C1E09FAF1F6&locationName=${cityName}`
  )
    .then(response => response.json())
    .then(data => {
      const locationData = data.records.location[0];
      const weatherElement = locationData.weatherElement.reduce(
        (neededElement, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElement[item.elementName] = item.time[0].parameter;
          }
          return neededElement;
        },
        {}
      );

      return {
        description: weatherElement.Wx.parameterName,
        weatherCode: weatherElement.Wx.parameterValue,
        rainPosibility: weatherElement.PoP.parameterName,
        comfortability: weatherElement.CI.parameterName
      };
    });
};

const useWeatherApi = currentLocation => {
  const { locationName, cityName } = currentLocation;

  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPosibility: 0,
    comfortability: "",
    isLoading: true
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForcast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForcast(cityName)
      ]);
      // console.log("data", data);
      setWeatherElement({
        ...currentWeather,
        ...weatherForcast,
        isLoading: false
      });
    };

    setWeatherElement(prevState => ({
      ...prevState,
      isLoading: true
    }));

    fetchingData();
  }, [locationName, cityName]);

  useEffect(() => {
    // console.log("execute");
    // what is changing here : async function
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
