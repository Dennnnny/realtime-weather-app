import React from "react";
import styled from "@emotion/styled";
import WeatherIcon from "./WeatherIcon.js";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";
const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999;
  background-color: ${({ theme }) => theme.foregroundColor};
  /* text-align: center; */
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  display: inline-flex;
  position: absolute;
  align-items: flex-end;
  font-size: 12px;
  right: 15px;
  bottom: 15px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: loading 1s infinite linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1s" : "0s")};
  }

  @keyframes loading {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 40px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = props => {
  const { cityName, weatherElement, moment, fetchData, setCurrentPage } = props;

  const {
    observationTime,
    // locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPosibility,
    comfortability,
    isLoading
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <Cog onClick={() => setCurrentPage("WeatherSetting")} />
      <Location>{cityName}</Location>
      <Description>
        {description} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        {/* <Cloudy /> */}
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || "night"}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {Math.round(rainPosibility)} %
      </Rain>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        觀測時間:
        {new Intl.DateTimeFormat("zh-TW", {
          month: "numeric",
          day: "numeric"
        }).format(new Date(observationTime))}{" "}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
