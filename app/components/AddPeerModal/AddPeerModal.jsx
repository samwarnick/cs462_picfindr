import React, { Component } from 'react';

export default class AddPeerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {url: '', previousUrl: '', showSuccessHidden: true};
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuccessfulAdd = this.handleSuccessfulAdd.bind(this);
    this.alertClosed = this.alertClosed.bind(this);
  }

  handleUrlChange(event) {
    this.setState({url: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    $.ajax({
      url: '/addPeer',
      dataType: 'json',
      type: 'POST',
      data: {url: this.state.url},
      success: () => {
        this.handleSuccessfulAdd();
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  }

  handleSuccessfulAdd() {
    this.setState({previousUrl: this.state.url});
    this.setState({url: ''});
    this.setState({showSuccessHidden: false});
  }

  alertClosed() {
    console.log('alert was closed');
    this.setState({previousUrl: ''});
    this.setState({showSuccessHidden: true});
  }

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
              <SuccessMessage url={this.state.previousUrl} hidden={this.state.showSuccessHidden} alertClosed={this.alertClosed}/>
              <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <span className="input-group-addon" id="basic-addon">http://</span>
                  <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon" placeholder="example.com" name="url" value={this.state.url} onChange={this.handleUrlChange}/>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary"><i className="fa fa-plus"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SuccessMessage extends Component {

  constructor(props) {
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
  }

  closeAlert() {
    $('.alert').alert('close');
    this.props.alertClosed();
  }

  render() {
    if (this.props.hidden) {
      return null;
    } else {
      return (
        <div className="alert alert-success fade in">
          <a href="#" className="close" onClick={this.closeAlert}>&times;</a>
          <strong>Success!</strong> {this.props.url} was added as a peer.
        </div>
      );
    }
  }
}

SuccessMessage.propTypes = {
  url: React.PropTypes.string.isRequired,
  hidden: React.PropTypes.bool.isRequired,
  alertClosed: React.PropTypes.func.isRequired
};
