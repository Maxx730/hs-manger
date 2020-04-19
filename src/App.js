import React from 'react';
import './App.css';

const DAYS = [0,1,2,3,4,5,6];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: null,
      focused: null
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/locations').then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        locations: data
      });
    });
  }

  render() {
    return(
        <div>
          {this.state.focused ? this.renderFocused() : this.renderList()}
        </div>
    )
  }

  renderList() {
    return(
        <div>
          {
            this.state.locations && this.state.locations.map(location => {
              return(
                  <li>
                    <a href={'#'} onClick={() => {
                      this.setState({
                        focused: location
                      });
                    }}>
                      {location.name}
                    </a>
                  </li>
              )
            })
          }
        </div>
    )
  }

  renderFocused() {
    console.log(this.state.focused)
    return(
        <div>
          <button onClick={() => {
            this.setState({
              focused: null
            });
          }}>Back</button>
          <div>
            <input type={'text'} value={this.state.focused.name}/>
            <div>
              <input type={'text'} value={this.state.focused.location.street}/>
              <input type={'text'} value={this.state.focused.location.city}/>
              <input type={'text'} value={this.state.focused.location.state}/>
              <input type={'text'} value={this.state.focused.location.lat}/>
              <input type={'text'} value={this.state.focused.location.long}/>
            </div>
            <div>
              {this.renderHours()}
            </div>
            <div>
              {this.renderDayDeals()}
            </div>
          </div>
        </div>
    )
  }

  renderHours() {
    return(
        <div>
          <h4>Hours</h4>
          {
            DAYS.map(day => {
              return(
                  <div>
                    {this.getDay(day)}:
                    <input type={'text'}/>
                  </div>
              )
            })
          }
        </div>
    )
  }

  renderDayDeals() {
    return(
        <div>
          <h4>Deals</h4>
          {
            DAYS.map(day => {
              return(
                  <div>
                    <span>{this.getDay(day)}: </span>
                    <div>
                      <button onClick={() => {
                        this.addDeal(day);
                      }}>Add Deal</button>
                    </div>
                    {this.state.focused.deals.map(dealDay => {
                      return(
                          <div>
                            {day === dealDay.day && this.listDeals(dealDay)}
                          </div>
                      )
                    })}
                  </div>
              )
            })
          }
        </div>
    )
  }

  listDeals(dealDay) {
    return(
        <div>
          {dealDay.deals.map((deal, index) => {
            return <input type={'text'} value={deal.description} onChange={(event) => {
              this.updateDeal(dealDay.day, index, event.target.value)
            }}/>
          })}
        </div>
    )
  }

  getDay(id) {
    switch(id) {
      case 0:
        return 'Sunday'
      case 1:
        return 'Monday'
      case 2:
        return 'Tuesday'
      case 3:
        return 'Wednesday'
      case 4:
        return 'Thursday'
      case 5:
        return 'Friday'
      case 6:
        return 'Saturday'
    }
  }

  updateDeal(day, deal, value) {
    let newFocused = JSON.parse(JSON.stringify(this.state.focused));

    for(let i = 0;i < newFocused.deals.length;i++) {
      if(newFocused.deals[i].day === day) {
        for(let k = 0;k < newFocused.deals[i].deals.length;k++) {
          if(k === deal) {
            newFocused.deals[i].deals[k].description = value;
            this.setState({
              focused: newFocused
            });
          }
        }
      }
    }
  }

  addDeal(day) {
    let newFocused = JSON.parse(JSON.stringify(this.state.focused));

    for(let i = 0;i < newFocused.deals.length;i++) {
      if(newFocused.deals[i].day === day) {
        console.log(day)
        newFocused.deals[i].deals.push({
          type: 'food',
          description: ''
        });
        this.setState({
          focused: newFocused
        });
      }
    }
  }
}

export default App;
