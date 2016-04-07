import React, { Component } from 'react';
import UploadModal from '../UploadModal/UploadModal.jsx';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand" href="#">Picfindr</a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="col-lg-3 nav-item">
            <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#uploadModal"><i className="fa fa-upload"></i></button>
          </li>
        </ul>
        <div className="col-lg-3 pull-xs-right">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search..." />
            <span className="input-group-btn">
              <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
            </span>
          </div>
        </div>

        <UploadModal />

      </nav>
    );
  }
}
