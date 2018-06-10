import React from 'react';
import ReactDOM from 'react-dom';
import ReactAnimatedWeather from 'react-animated-weather';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import Moment from 'react-moment';


const defaults = {
  icon: 'CLEAR_DAY',
  color: 'inherit',
  size: 64,
  animate: true
};


const dict =
{
  'clear-day':'CLEAR_DAY',
  'clear-night':'CLEAR_NIGHT',
  'partly-cloudy-day':'PARTLY_CLOUDY_DAY',
  'partly-cloudy-night':'PARTLY_CLOUDY_NIGHT',
  'cloudy':'CLOUDY',
  'rain':'RAIN',
  'sleet':'SLEET',
  'snow':'SNOW',
  'wind':'WIND',
  'fog':'FOG',
  'hail':'RAIN',
  'thunderstorm':'RAIN',
  'tornado':'WIND'
};


const WeatherRow = (props) => (
  <TableRow >
  <TableCell><Moment unix format="MM/DD/YYYY">{props.datum.time}</Moment></TableCell>
    <TableCell>{props.datum.apparentTemperatureHigh}</TableCell>
    <TableCell>{props.datum.apparentTemperatureHigh}/{props.datum.apparentTemperatureLow}</TableCell>
    <TableCell>{props.datum.humidity}%</TableCell>
    <TableCell>{props.datum.summary}</TableCell>
    <TableCell>{props.datum.windSpeed}</TableCell>
    <TableCell>
        <ReactAnimatedWeather
            icon={dict[props.datum.icon]}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}/>
    </TableCell>
  </TableRow>
)


function WeatherTable(props) {
  const weatherRows = props.weatherData.map(datum => <WeatherRow  datum={datum} />);

   return (
     <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>High/Low</TableCell>
                <TableCell>Humidity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Wind MPH</TableCell>
                <TableCell>ICON</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{weatherRows}</TableBody>
          </Table>
     </div>
  );
}




class GetWeather extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLonLatFromZip = this.getLonLatFromZip.bind(this);
    this.state = {weatherData: [], zipCodeErrorText: ''};

  }

   getLonLatFromZip(zip)
  {
    return new Promise((resolve,reject)=>{

      let serverUrl = '/' + zip;
      let cityDataRequest = new XMLHttpRequest();
      cityDataRequest.open('GET',serverUrl,true);

       cityDataRequest.onload = function() {
         if (this.readyState === 4 && this.status === 200) {
            // alert(JSON.parse(this.responseText));
           let response = JSON.parse(this.responseText);

           resolve({'Lat': response.Lat, 'Long': response.Long});

         }
         else {
           {
             reject('Could not find zip code');
           }
         }
       }
     cityDataRequest.send();
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.checkWeather;

    let city = form.zipcode.value;
    //need to get lat and long data from server
      let self = this;
    this.getLonLatFromZip(city).then((result)=>{


      let url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/41f274b696fa65192e89506d2c1c5fc4/${result.Lat},${result.Long}?exclude=currently
        ,minutely,hourly`;
        let request =  new XMLHttpRequest();
        request.open('GET', url, true);


      request.onload = function() {
        if (this.readyState === 4 && this.status === 200) {

          let response = JSON.parse(this.responseText);

          self.setState({weatherData: response.daily.data,zipCodeErrorText:''});


        }
      }
    request.send();



  }).catch(err=>{

    self.setState({zipCodeErrorText:err});
  });
  }

  render() {
    return (
      <div>
        <form style={{textAlign:'center'}} name="checkWeather" onSubmit={this.handleSubmit}>
          <TextField errorText={this.state.zipCodeErrorText} autofocus="true" type="text" name="zipcode" placeholder="Zip Code" />
          <Button  onClick={this.handleSubmit}>Get Weather</Button >
        </form>
        <WeatherTable weatherData={this.state.weatherData} />
      </div>
    )
  }
}



class MainComponent extends React.Component {
  constructor() {
    super();
  }



  render() {
    return (
      <div>
          <MuiThemeProvider>
              <AppBar position="static" style={{textAlign:'center'}} >
                  <Toolbar>
                      <Typography  variant="title" color="inherit">
                          Weather Tracker
                      </Typography>
                  </Toolbar>
              </AppBar>
              <GetWeather />
          </MuiThemeProvider>
      </div>


    );
  }
}

ReactDOM.render(<MainComponent />, document.getElementById('contents'));    // Render the component inside the content Node
