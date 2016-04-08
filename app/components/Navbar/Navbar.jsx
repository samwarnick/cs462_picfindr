import React, { Component } from 'react';
import UploadModal from '../UploadModal/UploadModal.jsx';
import AddPeerModal from '../AddPeerModal/AddPeerModal.jsx';

export default class Navbar extends Component {

  constructor(props) {
    super(props);
    var socket = this.props.socket;
    socket.on('test', (data) => {
      this.setState({searching: false});
      console.log(data);
    });
    this.state = {searchTag: '', searching: false};
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleSearchChange(event) {
    this.setState({searchTag: event.target.value});
  }

  handleSearchClick() {
    event.preventDefault();
    $.ajax({
      url: '/requestImage',
      dataType: 'json',
      type: 'POST',
      data: {tag: this.state.searchTag},
      success: () => {
        console.log('success');
        this.setState({searching: true});
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  }

  render() {
    return (
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand" href="#">Picfindr</a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="col-lg-3 nav-item">
            <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#uploadModal"><i className="fa fa-picture-o"></i></button>
          </li>
          <li className="col-lg-3 nav-item">
            <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#peerModal"><i className="fa fa-plus"></i> <i className="fa fa-server"></i></button>
          </li>
        </ul>
        <div className="col-lg-3 pull-xs-right">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search..." onChange={this.handleSearchChange}/>
            <span className="input-group-btn">
              <SearchButton searching={this.state.searching} onClick={this.handleSearchClick}/>
            </span>
          </div>
        </div>

        <UploadModal />

        <AddPeerModal />
      </nav>
    );
  }
}

Navbar.propTypes = {
  socket: React.PropTypes.object.isRequired
};

class SearchButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.searching) {
      return (
        <button className="btn btn-primary" id="searchButton" type="button" onClick={this.handleSearchClick}><i className="fa fa-circle-o-notch fa-spin" onClick={this.props.onClick}></i></button>
      );
    } else {
      return (
        <button className="btn btn-primary" id="searchButton" type="button" onClick={this.handleSearchClick}><i className="fa fa-search" onClick={this.props.onClick}></i></button>
      );
    }
  }
}

SearchButton.propTypes = {
  searching: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired
};
