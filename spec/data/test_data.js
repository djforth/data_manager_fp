let _      = require('lodash');
let Moment = require('moment-strftime');

let events = ['event', 'sport']
let item = {
  "id": 0,
  "title": "Lorem ipsum dolor",
  "subtitle": "sit amet, consectetur",
  "date": "2016-01-18",
  "start_time": "19:00:00",
  "finish_time": "22:00:00",
  "booking": "/booking/link",
  "event_date": "<strong>Tue 22 Mar</strong> | 7.00pm - 10.00pm",
  "asset_url": "image.png",
  "guestlist": "/guestlist/link",
  "filters": {
    "type": "event"
  }
}

function createItem(i, item){

  let date = Moment(item.date);
  date.add(i, 'd');
  var obj = {
    id:i, date:date.toDate()
  , event_date:date.format("ddd DD MMM") + "| 7.00pm - 10.00pm"
  , filters:{
      type:(i%2 === 0) ? 'event' : 'sport'
    }
  };
  return _.defaults(obj, item)
}

module.exports = {
  getJSON:(n)=>{
    let i = 0;
    let json = []
    do{
      json.push(createItem(i, item));
      i++;
    } while(i < n);
    return json;
  }
}