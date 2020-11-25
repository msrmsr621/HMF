import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';

var currentTabIndex=0;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 28,
  },
});

const Page = ({label, text = ''}) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      {label}
    </Text>
    <Text style={styles.instructions}>
      {text}
    </Text>
  </View>
);

const Tab = ({ tab, page, isTabActive, onPressHandler, onTabLayout, styles }) => {
  const { label, icon } = tab;
  console.log("isTabActive ", isTabActive);
  console.log("tab ", tab);
  console.log("page ", page);
  currentTabIndex=tab;

  const style = {
    marginHorizontal: 5,
    paddingVertical: 10,
  };
  const containerStyle = {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth:1,
    opacity: styles.opacity,
    transform: [{ scale: styles.opacity }],
  };
  const textStyle = {
    color: styles.textColor,
    fontWeight: '600',
  };
  return (
    <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default class UnderlineTabBarExample extends Component {
  _scrollX = new Animated.Value(0);
  // 6 is a quantity of tabs
  interpolators = Array.from({ length: 6 }, (_, i) => i).map(idx => ({
    scale: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#424242', '#6188ff', '#424242'],
    }),
    backgroundColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#00000000', '#00000000'],
      extrapolate: 'clamp',
    }),
    borderColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#6188ff', '#00000000'],
    }),
  }));
  render() {
    return (
      <View style={[styles.container, { paddingTop: 20 }]}>
        <ScrollableTabView
          renderTabBar={() => (
            <TabBar
              underlineColor="transparent"
              tabBarStyle={{ }}
              renderTab={(tab, page, isTabActive, onPressHandler, onTabLayout) => (
                <Tab
                  key={page}
                  tab={tab}
                  page={page}
                  isTabActive={isTabActive}
                  onPressHandler={onPressHandler}
                  onTabLayout={onTabLayout}
                  styles={this.interpolators[page]}
                />
              )}
            />
          )}
          onScroll={(x) => this._scrollX.setValue(x)}
        >
          <Page tabLabel={{label: "1D"}} label="Page #1 Hot" text="You can pass your own views to TabBar!"/>
          <Page tabLabel={{label: "1W"}} label="Page #2 Trending" text="Yehoo!!!"/>
          <Page tabLabel={{label: "1M"}} label="Page #3 Fresh" text="Hooray!"/>
          <Page tabLabel={{label: "3M"}} label="Page #4 Funny"/>
          <Page tabLabel={{label: "1Y"}} label="Page #5 Movie & TV"/>
          <Page tabLabel={{label: "ALL"}} label="Page #6 Sport"/>
        </ScrollableTabView>
      </View>
    );
  }
}