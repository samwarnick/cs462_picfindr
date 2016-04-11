import React, { Component } from 'react';
import './Navbar.css';
import UploadModal from '../UploadModal/UploadModal.jsx';
import AddPeerModal from '../AddPeerModal/AddPeerModal.jsx';

export default class Navbar extends Component {

  constructor(props) {
    super(props);

    this.state = {searchTag: '', searching: false, socket: this.props.socket, socket_id: this.props.socketId, tags: this.props.tags, filteredTags: []};
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.filterList = this.filterList.bind(this);

    this.state.socket.on('imageFound', () => {
      this.setState({searching: false});
    });
  }

  handleSearchChange(event) {
    this.setState({searchTag: event.target.value});
    this.filterList(event.target.value);
  }

  filterList(searchSoFar) {
    var list = [];
    if (searchSoFar !== '') {
      for (var tag of this.state.tags) {
        if (tag.includes(searchSoFar)) {
          list.push(tag);
        }
      }
    }
    this.setState({filteredTags: list});
  }

  handleSearchClick() {
    event.preventDefault();
    $.ajax({
      url: '/requestImage',
      dataType: 'json',
      type: 'POST',
      data: {tag: this.state.searchTag, socket_id: this.state.socket_id},
      success: () => {
        this.setState({searching: true});
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  }

  handleSelection(tag) {
    this.setState({searchTag: tag});
    $('#search-input').val(tag);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    var dropdown;
    if (this.state.filteredTags.length === 0) {
      dropdown = null;
    } else {
      var tags = this.state.filteredTags;
      var tagNodes = tags.map((tag, index) => {
        return (
          <a className="dropdown-item" href="#" key={index} onClick={this.handleSelection.bind(this, tag)}>{tag}</a>
        );
      }, this);
      dropdown = (<div className="dropdown-menu dropdown-menu-left">
        {tagNodes}
      </div>);
    }

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
        <div className="col-lg-3 pull-md-right" id="searchBar">
          <div className="input-group pull-right">
            <input type="text" className="form-control dropdown-toggle" id="search-input" placeholder="Search..." onChange={this.handleSearchChange} autoComplete="off" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
            {dropdown}
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
  socket: React.PropTypes.object.isRequired,
  socketId: React.PropTypes.string.isRequired,
  tags: React.PropTypes.array.isRequired
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
