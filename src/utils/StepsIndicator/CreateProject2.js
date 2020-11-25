import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Modal from 'react-native-modal';
import StepIndicator from 'react-native-step-indicator';
import COLORS from '../COLORS';

const labels = [
  'Basic Information',
  'Company Information',
  'Setup Confirmation Message',
];
const customStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 50,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: COLORS.sky,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: COLORS.sky,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: COLORS.sky,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: COLORS.sky,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 16,
  currentStepIndicatorLabelFontSize: 18,
  stepIndicatorLabelCurrentColor: COLORS.sky,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: COLORS.sky,
};

class CreateProject2 extends Component {
  state = {
    currentPosition: 1,
  };

  render() {
    return (
      <View style={{paddingVertical: 10, backgroundColor:COLORS.lightSky}}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={this.state.currentPosition}
          labels={labels}
          stepCount={3}
        />
      </View>
    );
  }
}

export default CreateProject2;
