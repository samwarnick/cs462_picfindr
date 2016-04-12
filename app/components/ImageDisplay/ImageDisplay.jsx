import React, { Component } from 'react';

export default class ImageDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {socket: this.props.socket};
    this.state.socket.on('imageFound', (data) => {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      if (data.image) {
        var img = new Image();
        img.src = 'data:image/jpeg;base64,' + data.buffer;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    return (
      <canvas id="canvas"></canvas>
    );
  }
}

ImageDisplay.propTypes = {
  socket: React.PropTypes.object.isRequired
};
