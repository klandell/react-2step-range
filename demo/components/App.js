import React, { Component } from 'react';
import Demo1 from './Demo1';
import Demo2 from './Demo2';

export default class App extends Component {
  render() {
    return (
      <div style={styles.app}>
        <Demo1 />
        <Demo2 />
      </div>
    );
  }
}

const styles = {
  app: {
    fontFamily: 'Raleway',
  },
};
