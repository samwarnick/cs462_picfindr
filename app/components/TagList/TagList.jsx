import React, { Component } from 'react';
import './TagList.css';

export default class TagList extends Component {

  constructor(props) {
    super(props);

    this.state = {tags: this.props.tags};
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {

    var tagNodes = this.state.tags.map((tag, index) => {
      return (
        <span className="label label-default" key={index}>{tag}</span>
      );
    });

    return (
      <div className="col-md-4 col-md-offset-4" id="available-container">
        <div className="card text-xs-center">
          <h2 className="card-header">Available Images</h2>
          <h5>{tagNodes}</h5>
        </div>
      </div>

    );
  }
}

TagList.propTypes = {
  tags: React.PropTypes.array
};
