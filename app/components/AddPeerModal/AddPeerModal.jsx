import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <div className="modal fade" id="peerModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="fa fa-times-circle"></i>
              </button>
              <h4 className="modal-title" id="myModalLabel">Add Peer</h4>
            </div>
            <div className="modal-body">
              <form action="/addPeer" method="post">
                <input type="text" className="form-control" id="url" placeholder="http://example.com" name="url" value=""/>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary"><i className="fa fa-plus"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
