import {StyleSheet} from 'react-native'
import {Fonts, Colors, Metrics, ApplicationStyles} from '../../../Themes/'
import {Image} from 'react-native'
import {Dimensions} from 'react-native';

let containerWidth = Dimensions.get('window').width;
//FAKE CARD STUFF TO PLAY WITH
let CARD_PREVIEW_WIDTH = 20
let CARD_MARGIN = 5;
let CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  dayTableTitle: {
    ...Fonts.style.goalTextTitle,
    color: Colors.snow,
    marginRight: 22,
    marginTop: 22,
    marginBottom: 16,
    paddingLeft: 15,
    textAlign: 'left'
  },
  graphYtext: {
    color: Colors.snow,
    textAlign: 'left',
    fontSize: 12
  },
  graphXtext: {
    color: Colors.snow,

    textAlign: 'left',
    marginTop: 6,
    marginBottom: 16
  },
  dateSelector: {
    marginBottom: 0,
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateSelectorText: {
    ...Fonts.style.h5,
    color: Colors.snow
  }
})
