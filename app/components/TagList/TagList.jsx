import React, { Component } from 'react';

export default class TagList extends Component {

  constructor(props) {
    super(props);

    this.state = {socket: this.props.socket, tags: []};
    this.state.socket.on('new tags', data => {
      this.setState(data);
    });
    $.ajax({
      url: '/tags',
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        console.log(data);
        this.setState(data);
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  }

  render() {

    var tagNodes = this.state.tags.map((tag) => {
      return (
        <li>{tag}</li>
      );
    });

    return (
      <div>
        <h2>Available Images</h2>
        <ul>
          {tagNodes}
        </ul>
      </div>
    );
  }
}

TagList.propTypes = {
  socket: React.PropTypes.object.isRequired
};
