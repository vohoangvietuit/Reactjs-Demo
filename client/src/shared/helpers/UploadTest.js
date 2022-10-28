import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from 'shared/components/TextFieldGroup';

import { uploadAvatar } from 'store/actions/uploadAction';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import {
  base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from './ResuableUtils';

const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const imageMaxSize = 6 * 1024 * 1024; // bytes
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim();
});

class UploadTest extends Component {
  constructor(props) {
    super(props);
    this.imagePreviewCanvasRef = React.createRef();
    this.fileInputRef = React.createRef();

    this.state = {
      file: '',
      caption: '',
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        x: 100,
        y: 100,
        width: 100,
        height: 150
      }
    };
  }

  // onChange = e => {
  //   this.setState({ [e.target.name]: e.target.value });
  // };

  // handleFileUpload = e => {
  //   const file = e.target.files[0];
  //   console.log('file', file);

  //   this.setState({ file: file });

  //   let data = new FormData();

  //   data.append('file', file);
  //   data.append('caption', 'Node fie');
  //   for (let item of data.entries()) {
  //     console.log('handle file', item);
  //   }
  // };

  // onSubmit = e => {
  //   e.preventDefault();
  //   const formData = {
  //     file: this.state.file,
  //     caption: this.state.caption
  //   };

  //   console.log('formdata', formData);
  //   this.props.uploadAvatar(formData);
  // };

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          'This file is not allowed. ' + currentFileSize + ' bytes is too large'
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert('This file is not allowed. Only images are allowed.');
        return false;
      }
      return true;
    }
  };
  onDrop = (files, rejectedFiles) => {
    console.log('onDrop', files);
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            // console.log(myFileItemReader.result)
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
            console.log(myResult);
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  handleImageLoaded = image => {
    // console.log('handleImageLoaded', image);
  };
  handleOnCropChange = crop => {
    this.setState({ crop });
    console.log('crop', this.state.crop);
  };
  handleOnCropComplete = (crop, pixelCrop) => {
    //console.log(crop, pixelCrop)

    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };
  handleDownloadClick = event => {
    event.preventDefault();
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;

      const { imgSrcExt } = this.state;
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt);

      const myFilename = 'previewFile.' + imgSrcExt;

      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      // download file
      downloadBase64File(imageData64, myFilename);
      this.handleClearToDefault();

      console.log('myNewCroppedFile: ', myNewCroppedFile);
    }
  };

  handleClearToDefault = event => {
    if (event) event.preventDefault();
    const canvas = this.imagePreviewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.setState({
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        x: 100,
        y: 100,
        width: 100,
        height: 150
      }
    });
    this.fileInputRef.current.value = null;
  };

  handleFileSelect = event => {
    // console.log(event)
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            // console.log(myFileItemReader.result)
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  render() {
    const { imgSrc } = this.state;

    return (
      // <div>
      //   <h2>Test Upload FormData</h2>
      //   <form onSubmit={this.onSubmit}>
      //     <input type="file" name="file" onChange={this.handleFileUpload} />
      //     <TextFieldGroup
      //       label="Caption"
      //       name="caption"
      //       placeholder="Enter Note"
      //       value={this.state.caption}
      //       onChange={this.onChange}
      //     />
      //     <input
      //       type="submit"
      //       value="Submit"
      //       className="btn btn-info btn-block mt-4"
      //     />
      //   </form>
      // </div>
      <div className="area-upload">
        <input
          ref={this.fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={false}
          onChange={this.handleFileSelect}
        />

        {imgSrc !== null ? (
          <div className="crop-area">
            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              minWidth={15}
              minHeight={20}
              maxWidth={70}
              maxHeight={80}
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />
            <br />
            <p>Preview Canvas Crop </p>
            <canvas ref={this.imagePreviewCanvasRef} />
            <button onClick={this.handleDownloadClick}>Download</button>
            <button onClick={this.handleClearToDefault}>Clear</button>
          </div>
        ) : (
          <div className="dropzone">
            <Dropzone
              onDrop={this.onDrop}
              accept={acceptedFileTypes}
              multiple={false}
              maxSize={imageMaxSize}
            >
              <p>
                Try dropping some files here, or click to select files to
                upload.
              </p>
            </Dropzone>
          </div>
        )}
      </div>
    );
  }
}

UploadTest.propTypes = {
  uploadAvatar: PropTypes.func.isRequired
};

export default connect(
  null,
  { uploadAvatar }
)(UploadTest);
