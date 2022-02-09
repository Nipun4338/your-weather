import React, {useState} from "react";
import { Button, Form, Container, Col, InputGroup, FormControl, Image } from 'react-bootstrap';
import Header from "./Header";
import Footer from "./Footer";
import data from "./data"


function Body(){

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    var location="Dhaka";
    const [isGet, setIsGet]=useState(true);
    const [tempLocation, setTempLocation]=useState("");
    

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
    function getData(){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+location+"&appid=553c6661ad613e2956211da2b465c7ad&units=metric")
      .then(res => res.json())
      .then(
        (result) => {
            setItems(result);
            setIsLoaded(true);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setItems(data);
          setIsLoaded(true);
          setError(error);
        }
      ).catch(error => {
        setItems(data);
        setIsLoaded(true);
      });
    }
    function firstFetch(){
        if(isGet)
        {
            setIsGet(false);
            getData();
        } 
    }

    firstFetch();

    function changeLocation(event){
        setIsGet(true);
        do{
            getData();
            setIsGet(false);
        }while(isGet)
        event.preventDefault();
    }

    function change(event){
      if(tempLocation.length>0)
      {
        location=tempLocation;
        setIsGet(true);
        do{
            getData();
            setIsGet(false);
        }while(isGet)
      }
      setTempLocation("");
      event.preventDefault();
    }

    function locationTextChange(event){
      var value=event.target.value;
      setTempLocation(value);
    }

    console.log(tempLocation);


  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const {cod}=items;
    if(cod === "404")
    {
      setItems(data);
      console.log(items);
      return <div>Error:</div>;
    }
    const {weather : [{icon, main: main2}]}=items;
    const {dt, main, wind, clouds, sys, name}=items;
    var weatherImg="http://openweathermap.org/img/wn/"+icon+"@2x.png";
    var sunrise=new Date(sys.sunrise*1000).toLocaleTimeString();
    var sunset=new Date(sys.sunset*1000).toLocaleTimeString();
    var fetchedTime=new Date(dt*1000).toLocaleTimeString();
    var hour=new Date().getHours();
    var backgroundImage="";
    if(hour>=20 && hour<=22)
    {
      backgroundImage="./IMG/night.jpg";
    }
    else if(hour>=4 && hour<=5)
    {
      backgroundImage="./IMG/dawn.jpg";
    }
    else if(hour>=5 && hour<=7)
    {
      backgroundImage="./IMG/mid-dawn.jpg";
    }
    else if(hour>=8 && hour<=10)
    {
      backgroundImage="./IMG/morning.jpg";
    }
    else if(hour>=11 && hour<=12)
    {
      backgroundImage="./IMG/mid-morning.jpg";
    }
    else if(hour>=13 && hour<=14)
    {
      backgroundImage="./IMG/noon.jpg";
    }
    else if(hour>=15 && hour<=16)
    {
      backgroundImage="./IMG/mid-noon.png";
    }
    else if(hour>=17 && hour<=18)
    {
      backgroundImage="./IMG/afternoon.jpg";
    }
    else if(hour>=19 && hour<20)
    {
      backgroundImage="./IMG/evening.jpg";
    }
    else{
      backgroundImage="./IMG/mid-night.jpg";
    }
    return (
    <div style={{backgroundImage: "url("+backgroundImage+")",
    height: "100%",
    width: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    opacity: "0.9"}}>
    <Header />
      <Container>
      <Col>
      <Form>
        <InputGroup className="mb-3">
        <FormControl
          placeholder="Accurate Location"
          aria-label="Location"
          aria-describedby="basic-addon2"
          name="locationText"
          onChange={locationTextChange}
          value={tempLocation}
        />
        <Button onClick={change} type="submit" variant="outline-primary" id="location">
          Get
        </Button>
        </InputGroup>
        </Form>
      </Col>
      <Col>
        <h1>{name}</h1>
        <h2>{main.temp}°C</h2>
        <p>Feel's like {main.feels_like}°C</p>
        <Image src={weatherImg} alt="Icon"/>
        <h4>{main2}</h4>
        <h5>Pressure: {main.pressure}hPa</h5>
        <h5>Humidity: {main.humidity}%</h5>
        <h5>Wind: {wind.speed} Km/pH at {wind.deg}°</h5>
        <h5>Cloudiness: {clouds.all}%</h5>
        <h5>Sunrise: {sunrise}</h5>
        <h5>Sunset: {sunset}</h5>
        <h3>Country: {sys.country}</h3>
        <p>Last fetched at: {fetchedTime}</p>
      </Col>
      <Button onClick={changeLocation} variant="outline-primary">Refresh</Button>
    </Container>
    <Footer />
    </div>
    );
  }
  
}

export default Body;