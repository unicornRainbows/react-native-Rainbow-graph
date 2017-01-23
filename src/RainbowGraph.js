import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  PanResponder,
  TouchableOpacity
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome'

//FAKE CARD STUFF TO PLAY WITH
let CARD_PREVIEW_WIDTH = 20
let CARD_MARGIN = 5;
let CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;
let containerWidth = Dimensions.get('window').width;

let graphWidth = CARD_WIDTH * (0.8)
let sideGraphWidth = CARD_WIDTH * (0.2)
let innerGraphWidth = CARD_WIDTH * (0.8)
let graphHeight = 0.15 * Dimensions.get('window').height

import styles from './RainbowGraphStyles'

export default class RainbowGraph extends Component {
  constructor(props, context) {
    super(props, context)
    /*
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollGoals = this.handleScrollGoals.bind(this);
    this.handleScrollOverview = this.handleScrollOverview.bind(this);
    this.handlePressMakeGoal = this.handlePressMakeGoal.bind(this);*/

    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      spaceBetween: 6,
      size: 20,
      color: '#000',
      lightSleep: null,
      deepSleep: null,
      remSleep: null,
      dataInfo: null,
      shouldForceUpdate: false
    }
  }

  groupByData(array, f) {
    var groups = {};
    array.forEach(function(o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    })
  }

  transformData() {
    console.log("transformData");
    var {daySleepData} = this.props
    //console.log(daySleepData);

    var {lightSleep, deepSleep, remSleep, dataInfo} = this.state

    if (daySleepData !== undefined && daySleepData !== null) {
      console.log("transformData started");
      lightSleep = daySleepData.events.filter(person => {
        if (person.subEventType === "none") {
          dataInfo = person
        } else if (person.subEventType === "stage_change") {
          if (person.eventDetails.sleepStage === "Light Sleep")
            return person.eventDetails
        } else {
          console.log("NO MATCH FOUND WRONG DATA");
        }
      });
      //get REM Sleep
      deepSleep = daySleepData.events.filter(person => {
        if (person.subEventType === "none") {
          dataInfo = person
        } else if (person.subEventType === "stage_change") {
          if (person.eventDetails.sleepStage === "Deep Sleep")
            return person.eventDetails
        } else {
          console.log("NO MATCH FOUND WRONG DATA");
        }
      });
      //get REM Sleep
      remSleep = daySleepData.events.filter(person => {
        if (person.subEventType === "none") {
          dataInfo = person
        } else if (person.subEventType === "stage_change") {
          if (person.eventDetails.sleepStage === "REM Sleep")
            return person.eventDetails
        } else {
          console.log("NO MATCH FOUND WRONG DATA");
        }
      });

      console.log("light data sorted");
      console.log(lightSleep.length);
      console.log("deepSleep data sorted");
      console.log(deepSleep.length);
      console.log("remSleep data sorted");
      console.log(remSleep.length);
      console.log("dataInfoDONE");
      //console.log(dataInfo.length);
      //this.setState({lightSleep, deepSleep, remSleep, dataInfo})
      /*  this.setState({
        lightSleep,
        deepSleep,
        remSleep,
        dataInfo
      }, () => {
        console.log("transformdata done force update");
        //console.log(this.state);
        //this.forceUpdate();

      });*/
      return {lightSleep, deepSleep, remSleep, dataInfo};
    }

    //this.forceUpdate()

  }

  componentWillMount() {
    console.log("rainbowgraph componentWillMount");

    let {startDate, endDate, authToken, daySleepData} = this.props

    if (daySleepData !== null && daySleepData.count > 0) {
      console.log(" componentWillMount transformData");

      this.transformData()

    }

    //this.transformData()
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        console.log("MOVE RESPONDER");
        console.log(gestureState.dx);
        console.log(gestureState.dy);

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        console.log("MOVE RELEASE");
        console.log(gestureState.dx);
        console.log(gestureState.dy);

        //CHECK FOR FUTURE OR PREVIOUS
        if (gestureState.dx > 50) {
          //PREVIOUS DATE
          this.props.getNewDayData(-1)
          //this.props.getDaySleepData(startDate, endDate);
        } else if (gestureState.dx < 50) {
          //FUTURE DATE
          this.props.getNewDayData(1)
        } else {
          console.log("MOVE MORE TO CHANGE DATES");
        }

        //CALL API WITH NEW DATES AND STUFF

      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

  componentDidMount() {
    /*
    this.state.data.forEach((val, index) => {
      //ANIMATE EACH BAR
    });
    */
  }

  componentWillUnmount() {}

  dayOfWeekAsString(dayIndex) {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ][dayIndex];
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("rainbow shouldComponentUpdate");
    if (this.props.daySleepData !== nextProps.daySleepData) {
      return true;
    }

    return true;
  }

  renderTopContainer() {
    var dateBasedOnSelectedTab = this.props.currentDate
    return (
      <View>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => {
            this.props.getNewDayData(-1)
          }}><Icon name="angle-left" size={10} color="#FFFFFF" style={{}}/></TouchableOpacity>
          <Text style={styles.dateSelectorText}>{dateBasedOnSelectedTab}</Text>
          <TouchableOpacity onPress={() => {
            this.props.getNewDayData(1)
          }}><Icon name="angle-right" size={10} color='#FFFFFF' style={{}}/></TouchableOpacity>

        </View>

      </View>
    )
  }

  roundTimeUp(time) {
    var splitted = time.split(':');
    var mins = parseInt(splitted[1]),
      hours = parseInt(splitted[0]);
    return (mins > 0
      ? hours + 1
      : hours) + ":00";
  }

  roundTimeDown(time) {
    var splitted = time.split(':');
    var mins = parseInt(splitted[1]),
      hours = parseInt(splitted[0]);
    return (mins > 0
      ? hours - 1
      : hours) + ":00";
  }

  render() {
    //this.transformData()
    var {daySleepData} = this.props

      var lightSleep,
        deepSleep,
        remSleep,
        dataInfo,
        topContainer

      //topContainer = this.renderTopContainer()

      console.log("datainfo not workiing");
      console.log(dataInfo);
      console.log("datainfo not workiing2");
      console.log(daySleepData);
      console.log("datainfo not workiing3");
      console.log(lightSleep);

      var transformedData

      if (daySleepData !== null) {
        console.log("about to transform from render");
        var transformedData = this.transformData()

        lightSleep = transformedData.lightSleep
        deepSleep = transformedData.deepSleep
        remSleep = transformedData.remSleep
        dataInfo = transformedData.dataInfo
        console.log("about to transform from render2");

        console.log(transformedData);

      }

      //ALL DATA MUST ALREADY BE TRANSFORMED BY HERE

      let numberOfUnits = 3
      let startTime
      let endTime
      let datesYaxis = ["Deep", "REM", "Light"];
      let datesXaxis = [];
      //endTime.setTime(startTime.getTime() + (int(dataInfo.duration) * 60 * 1000));

      let svgPathDeep //UNIT 1
      let svgPathLight //UNIT 2
      let svgPathREM //UNIT 3
      let borderLeft //
      let borderBottom //
      let heightRatio = graphHeight / numberOfUnits

      if (dataInfo && daySleepData.count > 0) {
        console.log("prehelllothere");
        var graphStartTime
        var graphEndTime
        var graphMinuteDifference
        let widthPerMinute

        //graphStartTime = new Date(daySleepData.startTime)
        //graphEndTime = new Date(daySleepData.endTime);
        graphStartTime = new Date(dataInfo.timestamp)
        graphEndTime = new Date(dataInfo.timestamp);
        graphEndTime.setSeconds(new Date(daySleepData.endTime).getSeconds() + dataInfo.duration);
        console.log("graph start and end time");
        console.log(graphStartTime);
        console.log(graphEndTime);
        console.log("get minutes DIFFERENCE");

        var diffMs = Math.abs(graphStartTime - graphEndTime);
        graphMinuteDifference = Math.floor((diffMs / 1000) / 60);
        widthPerMinute = graphWidth / graphMinuteDifference
        console.log(widthPerMinute);

        //BUILD datesXaxis
        var numberOfXaxis = 4
        //get first time

        var h = graphStartTime.getHours()
        //TIME ZONE ADJUST
        if (h === 0) {
          h = 24
        }
        h = h - parseInt(dataInfo.timeZoneOffset); //TIME ZONE ADJUST
        var m = graphStartTime.getMinutes();
        // add a zero in front of numbers<10
        m = this.checkTime(m);
        h = this.checkTime(h);
        datesXaxis.push(h + ":" + m)

        //end time
        //var h = graphStartTime.getHours(graphStartTime.setHours(graphStartTime.getHours() - 2)); //TIME ZONE ADJUST

        h = graphEndTime.getHours()
        //TIME ZONE ADJUST
        if (h === 0) {
          h = 24
        }
        h = h - parseInt(dataInfo.timeZoneOffset);

        m = graphEndTime.getMinutes();
        // add a zero in front of numbers<10
        m = this.checkTime(m);
        h = this.checkTime(h);
        datesXaxis.push(h + ":" + m)

        console.log("svgPathDeep");
        var i = 0
        svgPathDeep = deepSleep.map(function(name) {
          //CALCULATE START POINT
          i = i + 1

          var currentTimeStamp = new Date(name.timestamp)
          var diffFromBegining = Math.abs(graphStartTime - currentTimeStamp);
          var diffMinutesFromStart = Math.floor((diffFromBegining / 1000) / 60);

          var startPoint = widthPerMinute * diffMinutesFromStart
          var endPoint = widthPerMinute * (diffMinutesFromStart + (name.duration / 60))
          console.log(startPoint);
          console.log(endPoint);

          return (<Line key={i} x1={startPoint} y1={heightRatio * 0.5} x2={endPoint} y2={heightRatio * 0.5} stroke="#9dda47" strokeLinecap="butt" strokeWidth="10"/>);
        })

        console.log("svgPathREM");
        svgPathREM = remSleep.map(function(name) {
          //CALCULATE START POINT
          i = i + 1

          var currentTimeStamp = new Date(name.timestamp)
          var diffFromBegining = Math.abs(graphStartTime - currentTimeStamp);
          var diffMinutesFromStart = Math.floor((diffFromBegining / 1000) / 60);

          var startPoint = widthPerMinute * diffMinutesFromStart
          var endPoint = widthPerMinute * (diffMinutesFromStart + (name.duration / 60))
          console.log(startPoint);
          console.log(endPoint);

          return (<Line key={i} x1={startPoint} y1={heightRatio * 1.5} x2={endPoint} y2={heightRatio * 1.5} stroke="#FFFFFF" strokeLinecap="butt" strokeWidth="10"/>);
        })

        console.log("svgPathREM");
        svgPathLight = lightSleep.map(function(name) {
          //CALCULATE START POINT
          i = i + 1

          var currentTimeStamp = new Date(name.timestamp)
          var diffFromBegining = Math.abs(graphStartTime - currentTimeStamp);
          var diffMinutesFromStart = Math.floor((diffFromBegining / 1000) / 60);

          var startPoint = widthPerMinute * diffMinutesFromStart
          var endPoint = widthPerMinute * (diffMinutesFromStart + (name.duration / 60))
          console.log(startPoint);
          console.log(endPoint);

          return (<Line key={i} x1={startPoint} y1={heightRatio * 2.5} x2={endPoint} y2={heightRatio * 2.5} stroke="#f5bd23" strokeLinecap="butt" strokeWidth="10"/>);
        })

        console.log("teh ful list");
        var theDay = new Date(dataInfo.timestamp);
        var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var mm = theDay.getMonth();
        var myFriendlyDay = this.dayOfWeekAsString(theDay.getDay()) + ", " + m_names[mm] + " " + theDay.getDate();
        return (
          <View {...this._panResponder.panHandlers} width={CARD_WIDTH} style={{
            paddingHorizontal: CARD_PREVIEW_WIDTH,
            marginLeft: 20,
            marginRight: 20,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 10,
            overflow: 'hidden'
          }}>
            {/*topContainer*/}
            <Text style={styles.dayTableTitle}>{myFriendlyDay}</Text>
            <View width={graphWidth} height={graphHeight} ref="graphContainer" style={{
              position: "relative",
              width: graphWidth,
              height: graphHeight,
              marginLeft: sideGraphWidth,
              borderBottomColor: "#FFFFFF",
              borderLeftColor: "#FFFFFF",
              borderBottomWidth: 0.5,
              borderLeftWidth: 0.5,
              borderStyle: 'solid'
            }}>
              <Svg height={graphHeight} width={graphWidth} style={{
                transform: [
                  {
                    scaleY: 1
                  }
                ]
              }}>{svgPathDeep}{svgPathREM}{svgPathLight}</Svg>

            </View>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              paddingLeft: 15,
              paddingRight: 5,
              top: 50,
              position: 'absolute',
              height: graphHeight
            }}>
              {datesYaxis.map(function(daValue, index) {
                return (
                  <Text key={index} style={styles.graphYtext}>{daValue}</Text>
                )
              })}
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingLeft: 10,
              paddingRight: 10,
              marginLeft: sideGraphWidth
            }}>
              {datesXaxis.map(function(daDate, index) {
                console.log("datesXaxis " + daDate);
                return (
                  <Text key={index} style={styles.graphXtext}>{daDate}</Text>
                )
              })}
            </View>
          </View>
        );
      } else {
        return (
          <View {...this._panResponder.panHandlers} width={CARD_WIDTH} style={{
            paddingHorizontal: CARD_PREVIEW_WIDTH,
            marginLeft: 20,
            marginRight: 20,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 10,
            overflow: 'hidden'
          }}>
            {/*topContainer*/}
            <Text style={styles.dayTableTitle}>No data found for day</Text>
            <View width={graphWidth} height={graphHeight} ref="graphContainer" style={{
              position: "relative",
              width: graphWidth,
              height: graphHeight,
              marginLeft: sideGraphWidth
            }}></View>
          </View>
        );
      }

    }

  }
