import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';
import COLORS from './COLORS';

class SnackbarSuccess extends Component<{}> {
  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      visible: true,
    };
  }

  componentDidMount() {
    console.log('=====================SnackbarSuccess================');
    this.setState({visible: true});
  }

  _onDismissSnackBar = () => this.setState({visible: false});

  render() {
    const {visible} = this.state;
    // eslint-disable-next-line prettier/prettier
    console.log('visible ' + visible);
    return (
      <Snackbar
        visible={visible}
        duration={3500}
        style={{backgroundColor: COLORS.darkGreen}}
        onDismiss={this._onDismissSnackBar}>
        {this.props.responseMsg}
      </Snackbar>
    );
  }
}

export default SnackbarSuccess;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
