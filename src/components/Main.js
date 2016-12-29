require('normalize.css/normalize.css');
require('styles/App.css');

import React, { Component } from 'react';

let images = require('../data/imgs.json');
images = ((imageArray) => {
  for (var i = 0; i < imageArray.length; i ++) {
    imageArray[i].imageUrl = require('../images/' + imageArray[i].fileName);
  }
})(images);

class AppComponent extends Component {
  render() {
    return (
      <section className="stage">
        <section className="img">
        </section>
        <nav>
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
