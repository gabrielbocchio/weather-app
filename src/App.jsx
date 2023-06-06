import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';
import Confetti from 'react-dom-confetti';

function App() {
  const [weather, setWeather] = useState(null);
  const [input, setInput] = useState('');
  const [showWeather, setShowWeather] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [confettiColor, setConfettiColor] = useState(['#ff6f61', '#fd594e', '#fc4e42'])



  useEffect(() => {

  }, []);

  const weatherInput = (e) => {
    setInput(e.target.value);
  };

  const searchWeather = () => {
    if (input !== '') {
      setIsSearching(true);
      axios
        .get(
          `http://api.weatherapi.com/v1/current.json?key=f6c09e1e6e8949528fe153940230506&q=${input}`
        )
        .then((data) => {
          setWeather(data.data);
          setShowWeather(true);
          setIsSearching(false);
          const weatherCondition = data.data.current.condition.text.toLowerCase();
          if (weatherCondition.includes('sunny')) {
            setConfettiColor(['#f6de43', '#f3cd74', '#f5bb50']);
          } else if(weatherCondition.includes('cloudy' || 'rain')){
            setConfettiColor(['#3835fa', '#6663fa', '#330cdf']);
          }else if(weatherCondition.includes('overcast')){
            setConfettiColor(['#8a8a91', '#c7c7c7', '#59595a']);
          }
          else {
            setConfettiColor(['#ff6f61', '#fd594e', '#fc4e42']);
          } 

        })

        .catch((err) => {
          console.log(err);
          setIsSearching(false);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  const resetWeather = () => {
    setShowWeather(false);
  };

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 220,
    dragFriction: 0.12,
    duration: 10000,
    stagger: 2,
    width: '10px',
    height: '10px',
    colors: confettiColor,

  };

  return (
    <>
      <GlobalStyle />
      <Biribiri>
        <div>
          <div className="search">
            <Input
              type="text"
              onChange={weatherInput}
              onKeyPress={handleKeyPress}
              placeholder="Enter a location..."
            />
            <Button onClick={searchWeather} disabled={isSearching}>
              Search
              <Confetti active={isSearching} config={confettiConfig} />
            </Button>
          </div>
          {showWeather && weather && (
            <ClimaContainer
              key={weather?.location?.name}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>{weather.location.name}</h1>
              <h2>{weather.location.region}</h2>
              <div className="condition">
                <h3>{weather.current.condition.text}</h3>
                <img src={weather.current.condition.icon} alt="Weather Icon" />
                <h3>{weather.current.temp_c} °</h3>
              </div>
            </ClimaContainer>
          )}
        </div>
      </Biribiri>
    </>
  );
}



const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    overflow-y: hidden;
  }
`

const Biribiri = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgb(247, 240, 240);
  background: radial-gradient(circle, #fefefe 25%, #f3bfbf 90%);
`

const Input = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #616060;
  outline: none;
  transition: background-color 0.3s;
  margin: 15px;
  font-size: larger;

  &:focus {
    background-color: #f8f8f8;
  }
`

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  color: #fff;
  font-size: larger;
  font-weight: bold;
  background-color: #ff6f61;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s, color 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #fd594e;
    transform: scale(1.05);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background-color: #fc4e42;
    transform: scale(0.95);
    box-shadow: none;
  }
`

const ClimaContainer = styled(motion.div)`
  justify-content: center;
  text-align: center;
  padding: 10px;
  opacity: 0;
  transform: translateY(-100px);
  animation: fadeInDown 0.5s ease-in-out forwards;

  @keyframes fadeInDown {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default App;
