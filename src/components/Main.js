require('normalize.css/normalize.css');
require('styles/App.scss');

import React, { Component } from 'react';
import ReactDom from 'react-dom';

let images = require('../data/imgs.json');
images = ((imageArray) => {
  for (var i = 0; i < imageArray.length; i ++) {
    imageArray[i].imageUrl = require('../images/' + imageArray[i].fileName);
  }
  return imageArray;
})(images);

class ImageFigure extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.attr.center) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObject = this.props.attr.pos;
    if (this.props.attr.rotate) {
      (['MozT', 'msT', 'OT', 'WebkitT', 't']).forEach((value) => {
        styleObject[value + 'ransform'] = 'rotate(' + this.props.attr.rotate + 'deg)';
      });
    }

    let clazzName = 'img-figure';
    clazzName += this.props.attr.inverse ? ' inverse' : '';

    if (this.props.attr.center) {
      styleObject.zIndex = 11;
    }

    return (
      <figure className={clazzName} style={styleObject} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className=" img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class Indicator extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.attr.center) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let clazzName = 'indicator';
    clazzName += this.props.attr.center ? ' center' : '';
    clazzName += this.props.attr.inverse ? ' inverse' : '';
    return (
      <span className={clazzName} onClick={this.handleClick} ></span>
    );
  }
}

class AppComponent extends Component {

  constructor(props) {
    super(props);

    this.Constans = {
      center: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        top: [0, 0]
      },
      vPosRange: {
        left: [0, 0],
        topSecY: [0, 0]
      }
    };

    this.state = {
      imageArrangeArray:[
        //{
        //  pos: {
        //    left: 0,
        //    top: 0
        //  },
        //  rotate: 0,
        //  inverse: false,
        //  center: false
        //}
      ]
    }
  }

  getRandomRange(rangeArr) {
    let low = rangeArr[0];
    let high = rangeArr[1];
    let range = high - low;
    return Math.floor(Math.random() * range + low);
  }

  get30DegreeRandom() {
    return (Math.random() >= 0.5 ? '' : '-') + Math.random() * 30;
  }

  inverse(index) {
    return () => {
      let imageArrangeArr = this.state.imageArrangeArray;
      imageArrangeArr[index].inverse = !imageArrangeArr[index].inverse;
      this.setState({
        imageArrangeArray: imageArrangeArr
      });
    };
  }

  center(index) {
    return () => this.reArrange(index);
  }

  reArrange(index) {
    let imageArrangeArr = this.state.imageArrangeArray;

    // 移除将要设置在中心的图片对应的下标位置状态
    imageArrangeArr.splice(index, 1);

    // 随机0 ~ 1个图片,放置中心图之上
    let topNumber = Math.floor(Math.random() * 2);
    let topArray;
    let topArrangeIndex;
    if (topNumber > 0) {
      topArrangeIndex = Math.floor(Math.random() * (imageArrangeArr.length - topNumber));
      topArray = imageArrangeArr.splice(topArrangeIndex, topNumber);
      topArray.forEach((value, index) => {
        topArray[index] = {
          pos: {
            left: this.getRandomRange(this.Constans.vPosRange.left),
            top: this.getRandomRange(this.Constans.vPosRange.topSecY)
          },
          rotate: this.get30DegreeRandom(),
          center: false
        }
      });
    }

    const mid = imageArrangeArr.length / 2;
    for (let i = 0; i < imageArrangeArr.length; i ++) {
      let secX;

      if (i < mid) { // 左半区
        secX = this.Constans.hPosRange.leftSecX;
      } else { // 右半区
        secX = this.Constans.hPosRange.rightSecX;
      }

      imageArrangeArr[i] = {
        pos: {
          left: this.getRandomRange(secX),
          top: this.getRandomRange(this.Constans.hPosRange.top)
        },
        rotate: this.get30DegreeRandom(),
        center: false
      }
    }

    // 回写顶部图片
    if (topNumber > 0 && topArray) {
      topArray.forEach((value, index) => {
        imageArrangeArr.splice(topArrangeIndex + index, 0, topArray[index]);
      });
    }

    // 回写中心图片
    let centerImage = {
      pos: this.Constans.center,
      rotate: 0,
      inverse: false,
      center: true
    };
    imageArrangeArr.splice(index, 0, centerImage);

    // 更新状态
    this.setState({
      imageArrangeArray: imageArrangeArr
    });
  }

  componentDidMount() {
    let stageDom = ReactDom.findDOMNode(this.refs.stage);
    let stageDomWidth = stageDom.scrollWidth;
    let stageDomHeight = stageDom.scrollHeight;
    let halfStageWidth = Math.floor(stageDomWidth / 2);
    let halfStageHeight = Math.floor(stageDomHeight / 2);

    let imageFigureDom = ReactDom.findDOMNode(this.refs.image0);
    let imageWidth = imageFigureDom.scrollWidth;
    let imageHeight = imageFigureDom.scrollHeight;
    let halfImageWidth = Math.floor(imageWidth / 2);
    let halfImageHeight = Math.floor(imageHeight / 2);

    // 中心图片位置点
    this.Constans.center = {
      left: halfStageWidth - halfImageWidth,
      top: halfStageHeight - halfImageHeight
    };
    this.Constans.hPosRange = {
      leftSecX: [
        -halfImageWidth,
        halfStageWidth - halfImageWidth * 3
      ],
      rightSecX: [
        halfStageWidth + halfImageWidth,
        stageDomWidth - halfImageWidth
      ],
      top: [
        -halfImageHeight,
        stageDomHeight - halfImageHeight
      ]
    };
    this.Constans.vPosRange = {
      left: [
        halfStageWidth - imageWidth,
        halfStageWidth
      ],
      topSecY: [
        -halfImageHeight,
        halfStageHeight - halfImageHeight * 3
      ]
    };

    this.reArrange(0);
  }

  render() {

    let figures = [], indicator = [];
    images.forEach((image, index) => {
      if (!this.state.imageArrangeArray[index]) {
        this.state.imageArrangeArray[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          inverse:false,//图片是否旋转
          isCenter: false
        }
      }
      figures.push(<ImageFigure key={index}
                                index={index}
                                data={image}
                                ref={'image' + index}
                                inverse={this.inverse(index)}
                                center={this.center(index)}
                                attr={this.state.imageArrangeArray[index]} />)
      indicator.push(<Indicator key={index}
                                index={index}
                                inverse={this.inverse(index)}
                                center={this.center(index)}
                                attr={this.state.imageArrangeArray[index]} />)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {figures}
        </section>
        <nav className="controller-nav">
          {indicator}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
