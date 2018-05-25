import React from 'react';
import ReactDOM from 'react-dom';
import ReactAnimatedWeather from 'react-animated-weather';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
//import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {Line} from 'react-chartjs-2';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {Tabs, Tab} from 'material-ui/Tabs';


/*
const icon =[

   'CLEAR_DAY',
    'CLEAR_NIGHT',
   'PARTLY_CLOUDY_DAY',
   'PARTLY_CLOUDY_NIGHT',
   'CLOUDY',
   'RAIN',
   'SLEET',
   'SNOW',
   'WIND',
   'FOG'
};
*/

// 200,300,500s use Rain
// 600s use snow
//700s use FOG
// 800 use  clear day/ clear night
//80x use clouds
/*
swtch(int)
{



}
*/

/*
class WeatherDay extends React.Component{

  constructor(props)
  {
    super(props);
    this.state{
      day: [],
      time: [],
      temp: [],
      tempMin: [],
      tempMax: [],
      humidity :[],
      rainChance: [],
      weather:[],
      clouds:[],
      wind: []

    };
  }


}

var timestamp = 654524560; // UNIX timestamp in seconds
var xx = new Date();
xx.setTime(timestamp*1000); // javascript timestamps are in milliseconds

*/

function kToF(kel)
{
  return kel * (9/5) - 459.67;
}
//<TableRowColumn>{props.datum.dt_txt}</TableRowColumn>
const WeatherRow = (props) => (
  <TableRow >

  <TableRowColumn>{props.datum.dt_txt}</TableRowColumn>
    <TableRowColumn>{kToF(props.datum.main.temp.toFixed(1))}</TableRowColumn>
    <TableRowColumn>{props.datum.main.temp_min}/{props.datum.main.temp_max}</TableRowColumn>
    <TableRowColumn>{props.datum.main.humidity}%</TableRowColumn>
    <TableRowColumn>{props.datum.weather[0].description}</TableRowColumn>
    <TableRowColumn>{props.datum.wind.speed*2.24}</TableRowColumn>

  </TableRow>
)



function WeatherTable(props) {
//  const weatherRows = props.weatherData.map(datum => <WeatherRow  datum={datum} />)



  //need to separate based on day

  let days = [[],[],[],[],[]];

//about 8 results per day
let weatherRows = 0;
let weatherRows2 = 0;


if(props.weatherData.length !=0)
{
  for(var numOfDays= 0; numOfDays < 5;numOfDays++)
  {

        let singleDay = props.weatherData[numOfDays*8].dt_txt.substring(0,10); // yyyy-mm-dd

        for(var i = 0; i < 7; i++)
        {
            let v = props.weatherData[i+ numOfDays*8].dt_txt.substring(0,10);
                if( v === singleDay)
                {
                    days[numOfDays].push(props.weatherData[i+ numOfDays*8]);
                  }

        }
  }

    weatherRows = days[0].map(datum => <WeatherRow  datum={datum} />);

    weatherRows2 = {
      labels: [0,1,2,3,4,5,6],
      datasets: [
          {
            label: 'Todays weather',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [days[0][0].main.temp,days[0][1].main.temp,days[0][2].main.temp,days[0][3].main.temp,
                  days[0][4].main.temp,days[0][5].main.temp,days[0][6].main.temp
          ]

          }]


      };


}
  //const
    //const weatherRows1 = days[0].map(datum => <WeatherRow  datum={datum} />);
  //    const weatherRows3 = days[0].map(datum => <WeatherRow  datum={datum} />);
      //  const weatherRows4 = days[0].map(datum => <WeatherRow  datum={datum} />);
      //    const weatherRows5 = days[0].map(datum => <WeatherRow  datum={datum} />);
  //
   return (
     <div>
          <Table>
            <TableHeader>
              <TableRow>

                <TableHeaderColumn>Day</TableHeaderColumn>
                <TableHeaderColumn>Temperature</TableHeaderColumn>
                <TableHeaderColumn>High/Low</TableHeaderColumn>
                <TableHeaderColumn>Humidity</TableHeaderColumn>
                <TableHeaderColumn>Description</TableHeaderColumn>
                <TableHeaderColumn>Wind MPH</TableHeaderColumn>

              </TableRow>

            </TableHeader>
            <TableBody>{weatherRows}</TableBody>

          </Table>

            <Line data={weatherRows2} />

          </div>

  );
}





class GetWeather extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {weatherData: []};

  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.checkWeather;

    let city = form.zipcode.value;
    let request = new XMLHttpRequest();
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c3af11a2c8f2b862ff1cd62e0f348861`;
    let response = 0;
    let self = this;
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
       response = JSON.parse(this.responseText);

        self.setState({weatherData: response.list});
        //alert(`The humidity in ${city} is ${response.list[0].main.humidity} and temp is ${response.list[0].main.temp}`);
      //  console.log(`${response}`);

      }
    }

    request.open("GET", url, true);
    request.send();


  }

  render() {
    return (
      <div>
        <form name="checkWeather" onSubmit={this.handleSubmit}>
          <TextField type="text" name="zipcode" placeholder="Zip Code" />
          <FlatButton  onClick={this.handleSubmit}>Get Weather</FlatButton  >
        </form>
        <WeatherTable weatherData={this.state.weatherData} />
      </div>
    )
  }
}




const defaults = {
  icon: 'CLEAR_DAY',
  color: 'goldenrod',
  size: 64,
  animate: true
};

class MainComponent extends React.Component {
  constructor() {
    super();
  //  this.state = { issues: [] };

  }

//  <ReactAnimatedWeather icon={defaults.icon} color={defaults.color} size={defaults.size} animate={defaults.animate} />

  render() {
    return (

      <div>
      <MuiThemeProvider>
          <AppBar title ="Weather Tracker" style={{textAlign:'center'}} />
          <GetWeather />

      </MuiThemeProvider>
      </div>


    );
  }
}

ReactDOM.render(<MainComponent />, document.getElementById('contents'));    // Render the component inside the content Node
