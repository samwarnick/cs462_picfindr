import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <div className="modal fade" id="uploadModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="fa fa-times-circle"></i>
              </button>
              <h4 className="modal-title" id="myModalLabel">Upload Image</h4>
            </div>
            <div className="modal-body">
              <form action="/">
                <input type="file" name="file" id="file" className="inputfile" accept="image/*" />
                <label forName="file">Choose an image</label>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary"><i className="fa fa-upload"></i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
