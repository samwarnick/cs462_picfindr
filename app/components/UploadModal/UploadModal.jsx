import React, { Component } from 'react';

export default class UploadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {data_uri: null, file: null, uploading: false, socketId: this.props.socketId};

    this.handleFile = this.handleFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuccessfulLoad = this.handleSuccessfulLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({uploading: true});
    var formData = new FormData();
    formData.append('displayImage', this.state.file);
    formData.append('id', this.state.socketId);
    $.ajax({
      url: '/tag',
      dataType: 'json',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: () => {
        this.handleSuccessfulLoad();
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  }

  handleFile(event) {
    var file = event.target.files[0];
    this.setState({file: file});
  }

  handleSuccessfulLoad() {
    this.setState({uploading: false});
    $('#uploadModal').modal('hide');
  }

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
              <form method="post" encType='multipart/form-data'>
                <input type="file" name="displayImage" id="file" accept="image/*" onChange={this.handleFile}/>
                <label forName="file">Choose an image</label>
                <div className="modal-footer">
                  <UploadButton uploading={this.state.uploading} onClick={this.handleSubmit}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UploadModal.propTypes = {
  socketId: React.PropTypes.string.isRequired,
};

class UploadButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.uploading) {
      return (
        <button className="btn btn-primary" id="searchButton" type="button" onClick={this.handleSearchClick}><i className="fa fa-circle-o-notch fa-spin" disabled></i></button>
      );
    } else {
      return (
        <button type="submit" className="btn btn-primary" onClick={this.props.onClick}><i className="fa fa-upload"></i></button>
      );
    }
  }
}

UploadButton.propTypes = {
  uploading: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired
};
