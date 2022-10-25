import React, { Component } from 'react';
import * as Font from 'expo-font';
import { Provider } from "mobx-react";
import { Dimensions, StatusBar, View, Platform, AppRegistry } from 'react-native';
import { createNavigator, createAppContainer, addNavigationHelpers } from 'react-navigation';
import stores from "./mobx"
import ScalingDrawer from './elements/ScalingDrawer';

import LeftMenu from './components/LeftMenu';
import HealerRouter from './routes/IntroStack';

const {width, height} = Dimensions.get('window');

const defaultScalingDrawerConfig = {
  scalingFactor: 0.8,
  minimizeFactor: 0.7,
  swipeOffset: 0
};

class CustomDrawerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /** Active Drawer Swipe **/
    if (nextProps.navigation.state.index === 0)
      this._drawer.blockSwipeAbleDrawer(false);

    if (
      nextProps.navigation.state.index === 0
      && this.props.navigation.state.index === 0
    ) {
      this._drawer.blockSwipeAbleDrawer(false);
      this._drawer.close();
    }

    /** Block Drawer Swipe **/
    if (nextProps.navigation.state.index > 0) {
      this._drawer.blockSwipeAbleDrawer(true);
    }
  }

  render() {
    if (this.state.fontLoaded === false) {
      return (
        <View />
      )
    }

    const { routes, index } = this.props.navigation.state;

    const ActiveScreen = HealerRouter.getComponentForState(this.props.navigation.state);

    return (
      <ScalingDrawer
        ref={ref => this._drawer = ref}
        content={ <LeftMenu drawer={this._drawer} navigation={this.props.navigation} /> }
        {...defaultScalingDrawerConfig}
      >
        <StatusBar backgroundColor={'transparent'} translucent />
        <View style={{ flex: 1, height: height }}>
          <ActiveScreen
            navigation={{
              ...this.props.navigation,
              state: routes[index],
              openDrawer: () => this._drawer.open(),
              closeDrawer: () => this._drawer.close(),
            }}
          />
        </View>
      </ScalingDrawer>
    )
  }
}

const AppNavigator = createNavigator(CustomDrawerView, HealerRouter, {});
const AppContainer = createAppContainer(AppNavigator);

export default () => {
  return (
    <Provider {...stores}>
      <AppContainer />
    </Provider>
  )
};
