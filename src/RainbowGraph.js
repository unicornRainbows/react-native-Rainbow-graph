import React, {Component, PropTypes} from 'react';
import {View, Text} from 'react-native';

export default class RainbowGraph extends Component {
    static propTypes = {
        data: PropTypes.object,
        color: PropTypes.string
    };

    static defaultProps = {
        spaceBetween: 4,
        size: 20,
        color: '#000'
    };

    state = {
        data: []
    };

    componentDidMount() {
        /*
    this.state.data.forEach((val, index) => {
      //ANIMATE EACH BAR
    });
    */
    }

    componentWillUnmount() {}

    render() {
        const width = 300
        const height = 300

        return (
            <View width={width} height={height}>
                <Text>The graph goes HERE...</Text>
            </View>
        );
    }
}
