import React, { Component } from 'react';

export default class ImageDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {socket: this.props.socket};
    this.state.socket.on('imageFound', (data) => {
      var ctx = document.getElementById('canvas').getContext('2d');
      if (data.image) {
        var img = new Image();
        img.src = 'data:image/jpeg;base64,' + data.buffer;
        ctx.drawImage(img, 0, 0);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-4" id="available-container">
        <canvas id="canvas"></canvas>
      </div>

    );
  }
}

ImageDisplay.propTypes = {
  socket: React.PropTypes.object.isRequired
};
