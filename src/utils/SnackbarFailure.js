import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';
import COLORS from './COLORS';

export default class SnackbarFailure extends Component<{}>  {
  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      visible: true,
    };
  }

  _onDismissSnackBar = () => this.setState({visible: false});

  render() {
    const {visible} = this.state;

    return (
      <Snackbar
        visible={this.state.visible}
        duration={3500}
        style={{backgroundColor: COLORS.failureColor}}
        onDismiss={this._onDismissSnackBar}>
        {this.props.responseMsg}
      </Snackbar>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
