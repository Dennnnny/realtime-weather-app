import React from "react";
import { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import { findLocation } from "./utils";
import WeatherCard from "./WeatherCard";
import useWeatherApi from "./useWeatherApi";
import WeatherSetting from "./WeatherSetting";
import sunriseAndSunsetData from "./sunrise-sunset.json";
// second try is async version

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#121212"
  },
  dark: {
    backgroundColor: "#1f2022",
    foregroundColor: "#121416",
    boxShadow: "0 1px 4px 0 rgba(12,12,13,0.2),0 0 0 1px rgba(0,0,0,0.15)",
    titleColor: "#f9f9f9",
    temperatureColor: "#ddd",
    textColor: "#ccc"
  }
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment = locationName => {
  const location = sunriseAndSunsetData.find(
    data => data.locationName === locationName
  );

  if (!location) return null;

  const now = new Date();

  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  const locationData =
    location.time && location.time.find(time => time.dataTime === nowDate);

  const sunriseTimeStamp = new Date(
    `${locationData.dateTime} ${locationData.sunrise}`
  ).getTime();

  const sunsetTimeStamp = new Date(
    `${locationData.dateTime} ${locationData.sunset}`
  ).getTime();

  const nowTimeStamp = now.getTime();

  return sunriseTimeStamp <= nowTimeStamp && nowTimeStamp <= sunsetTimeStamp
    ? "day"
    : "night";
};

// const Cloudy = styled(CloudyIcon)`
//   flex-basis: 30%;
// `;

const WeatherApp = () => {
  // console.log("invoke component");
  const storageCity = localStorage.getItem("cityName");

  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");

  const currentLocation = findLocation(currentCity) || {};

  const [weatherElement, fetchData] = useWeatherApi(currentLocation);

  const [currentTheme, setCurrentTheme] = useState("dark");

  const [currentPage, setCurrentPage] = useState("WeatherCard");

  // const { locationName } = weatherElement;

  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName
  ]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* {console.log(weatherElement.isLoading)} */}

        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
