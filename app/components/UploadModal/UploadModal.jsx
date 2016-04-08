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
              <form action="/tag" method="post" encType='multipart/form-data'>
                <input type="file" name="displayImage" id="file" accept="image/*" />
                <label forName="file">Choose an image</label>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary"><i className="fa fa-upload"></i></button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
