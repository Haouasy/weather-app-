 "use strict";
// // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}    API request


class App{
api_key = "c8788be2f34fd8f3fbd129e9f4c5e6b4";
form = document.querySelector(".form");
constructor(){
this.form.addEventListener("submit",function(e){
    e.preventDefault();
    this._execute();
    
}.bind(this));
this._setDays();
this._onload();
}
_onload(){
  let lat,lon;
  const pos = navigator.geolocation.getCurrentPosition(function(pos){
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    this._getToday();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m&daily=weather_code,sunrise,sunset&timeformat=unixtime`;
    const data = this._getDatafor7days(lat,lon).then(data=>{
    document.querySelector(".temperature__today").innerHTML = Math.round(data.current.temperature_2m) + "°";
    document.querySelector(".wind__status").innerHTML= data.current.wind_speed_10m + "km/h";
    document.querySelector(".humidity__level").innerHTML = data.current.relative_humidity_2m + "%";
    document.querySelector(".sunrise").innerHTML= this._sunrise(data.daily.sunrise[0]);
    document.querySelector(".time__left--sunrise").innerHTML= this._timeLeft(data.daily.sunrise[0]);
    document.querySelector(".sunset").innerHTML= this._sunrise(data.daily.sunset[0]);
    document.querySelector(".time__left--sunset").innerHTML= this._timeLeft(data.daily.sunset[0]);
    
    this._descSetting(data);
    });
    
  }.bind(this));
  

}

async _execute(){
    const country = document.querySelector(".place__input").value;
    const api_call = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${this.api_key}`
    const response =  await fetch(api_call);
    
    if(!response.ok){
        alert("Name of that city doesnt exist");
    }
    else{
    const data = await response.json();
    console.log(data);
    
    document.querySelector(".place__input").innerHTML = data.name;
    document.querySelector(".wind__status").innerHTML= data.wind.speed + "km/h";
    document.querySelector(".sunrise").innerHTML= this._sunrise(data.sys.sunrise);
    document.querySelector(".time__left--sunrise").innerHTML= this._timeLeft(data.sys.sunrise);
    document.querySelector(".sunset").innerHTML= this._sunset(data.sys.sunset);
    document.querySelector(".time__left--sunset").innerHTML= this._timeLeft(data.sys.sunset);
    document.querySelector(".humidity__level").innerHTML = data.main.humidity + "%";
    document.querySelector(".humidity__status").innerHTML = this._humidity(data.main.humidity);
    document.querySelector(".visibility__level").innerHTML = String( data.visibility/1000);
    document.querySelector(".visibility__status").innerHTML = this._visibility(data.visibility);
    this._getToday();
      console.log(this._getDatafor7days(data.coord.lat,data.coord.lon).then(data=>{
        document.querySelector(".temperature__today").innerHTML = Math.round(data.current.temperature_2m) + "°";
        this._descSetting(data)
      }))
      
      document.querySelector(".chosen__place--text").innerHTML = country.toUpperCase();
    }}
    _setDays() {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date();
      let start = date.getDay();
      console.log(start);
      for (let i = 0; i < 7; i++) {
          const dayIndex = (start + i) % 7;
          document.querySelector(`.day${i}`).innerHTML = days[dayIndex];
      }
  }
  
    _timeLeft(time){
      
      let res;
      time = new Date(time*1000)
      const date  = new Date();
      const h1 = time.getHours();
      const h2 = date.getHours();
      let m = time.getMinutes()-date.getMinutes();
      if(h1<h2){
        res = (24-(Math.abs(h1-h2)));
      }
      else{
        res = Math.abs(h1-h2)
      }
      if(m<0){
        m = 60+m;
        res -= 1;
      }
      if(m<10){
        return `-${res}:0${m}`;
      }
      else{
        return `-${res}:${m}`
      }
      
    }
_sunset(data){
  let sunset
    const timeunix = data;
    const date = new Date(timeunix*1000);
    if(date.getMinutes()<10){
      sunset = `${date.getHours()}:0${date.getMinutes()}`
    }
    else{
      sunset = `${date.getHours()}:${date.getMinutes()}`;
    }
     
    return sunset ;
}
_sunrise(data){
  let sunrise;
    const timeunix2 = data;
    const date2 = new Date(timeunix2*1000);
    if(date2.getMinutes()<10){
       sunrise = `${date2.getHours()}:0${date2.getMinutes()}`;
    }
    else{
      sunrise = `${date2.getHours()}:${date2.getMinutes()}`
    }
    
    return sunrise;
}
_humidity(humidity){
    let status = "";
    if(humidity >= 30 && humidity <= 60){
        status ="Normal 🤙";
    }
    else{
        status = "Problematic☹️"
    }
    return status;
}
_visibility(v){
    let vis = ""
    if(v>10000){
        vis="Excellent";
    }
    else if(v<10000 && v>5000){
        vis = "Good";
    }
    else if(v<5000 && v>3000){
        vis = "Average"
    }
    else{
        vis = "Very bad";
    }
    return vis;
}
_getDatafor7days = async (lat, lon) => {  
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m&daily=weather_code,sunrise,sunset&timeformat=unixtime`;

  return fetch(url).then(res => {
      return res.json().then(data=>{
        return data;
      })
  });
};

      _getWeather = function(code){
        switch(code){
          case 0 : return "Clear sky";
          case 1 : return "Mainly clear";
          case 2 : return "Partly cloudy";
          case 3 : return "Overcast";
          case 45:
            case 48 : return "Fog";
          case 51 : return "Light drizzle";
          case 53 : return "Moderate drizzle";
          case 55 : return "Dense drizzle";
          case 56:
            case 57 : return "Freezing drizzle";
          case 61:
            case 63:
              case 65 : return "Rain";
          case 66:
            case 67 : return "Freezing Rain";
          case 71:
            case 73:
              case 75 : return "Snow fall";
          case 77 : return "Snow grains";
          case 80:
            case 81:
              case 82:
                case 85:
                   case 86 : return "Snow showers";
          case 95:
            case 96:
              case 99 :return 'Thnuderstorm'

          
        }
      }
      _getToday(){ 
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const date = new Date();
        if(date.getMinutes()<10){
          document.querySelector(".daytime").innerHTML = `${days[date.getDay()]},${date.getHours()}:0${date.getMinutes()}`;
        }
        document.querySelector(".daytime").innerHTML = `${days[date.getDay()]},${date.getHours()}:${date.getMinutes()}`;
        return date.getDay();

      }
      _descSetting(data){
        const imgsidebar = document.querySelector(".condition"); 
        data.daily.weather_code.forEach((code,i)=>{
          const cond = this._getWeather(code);
          document.querySelector(`.day${i}t`).innerHTML = cond;
          let img = document.querySelector(`.day${i}im`);
          if(cond.toLowerCase().includes("rain")){
            if(i===0){
              imgsidebar.src = "icons/rainy.png"
            }
            img.src = `icons/rainy.png`;
          }
          else if(cond.toLowerCase().includes("sun")){
            if(i===0){
              imgsidebar.src = "icons/sun.png"
            }
            img.src = `icons/sun.png`
          }
          else if(cond.toLowerCase().includes("cloud")){
            if(i===0){
              imgsidebar.src = "icons/cloudy.png"
            }
            img.src = `icons/cloudy.png`
          }
          else if(cond.toLowerCase().includes("clear")){
            if(i===0){
              imgsidebar.src = "icons/sun.png"
            }
            img.src = `icons/sun.png`
          }
          else if(cond.toLowerCase().includes("snow")){
            if(i===0){
              imgsidebar.src = "icons/snow.png"
            }
            img.src = `icons/snow.png`
          }
          else if(cond.toLowerCase().includes("fog")){
            if(i===0){
              imgsidebar.src = "icons/fog.png"
            }
            img.src = `icons/fog.png`
          }
          else if(cond.toLowerCase().includes("storm")){
            if(i===0){
              imgsidebar.src = "icons/storm.png"
            }
            img.src = `icons/storm.png`
          }
          else if(cond.toLowerCase().includes("drizzle")){
            if(i===0){
              imgsidebar.src = "icons/drizzle.png"
            }
            img.src = `icons/drizzle.png`
          }
          else if(cond.toLowerCase().includes("overcast")){
            if(i===0){
              imgsidebar.src = "icons/overcast.png"
            }
            img.src = `icons/overcast.png`
          }
  
        })
      }
}
  // 
const app = new App();
  // const url = "https://api.open-meteo.com/v1/forecast?latitude=10&longitude=10&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m&daily=weather_code,sunrise,sunset&timeformat=unixtime"