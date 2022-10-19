import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { uploadImage } from '../../actions/uploadAction';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from './ResuableUtils';

import './UploadImage.css';

const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const imageMaxSize = 2 * 1024 * 1024; // 2 MB
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim();
});

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.imagePreviewCanvasRef = React.createRef();

    this.state = {
      croppedImageUrl: null,
      file: null,
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 1 / 1,
        x: 100,
        y: 100,
        width: 200,
        height: 200
      }
    };
  }

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

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const { imgSrcExt } = this.state;
      const myFilename = 'previewFile.' + imgSrcExt;
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        myFilename
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  // handleImageLoaded = image => {};

  // handleOnCropChange = crop => {
  //   this.setState({ crop });
  // };

  // handleOnCropComplete = (crop, pixelCrop) => {
  //   const canvasRef = this.imagePreviewCanvasRef.current;
  //   const { imgSrc } = this.state;
  //   console.log('pixelCrop', pixelCrop);
  //   image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  // };

  handleGetImageResize = event => {
    event.preventDefault();
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;

      const { imgSrcExt } = this.state;
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt);

      const myFilename = 'previewFile.' + imgSrcExt;

      (async () => {
        // file to be uploaded
        const myNewCroppedFile = await base64StringtoFile(
          imageData64,
          myFilename
        );
        // Get image resize
        this.setState({ file: myNewCroppedFile });

        // Call parent method
        this.props.onChange(this.state.file);
        // TEST Upload image
        // this.props.uploadImage(myNewCroppedFile);
      })();

      // Clear
      // this.handleClearToDefault();
    }
  };

  // handleClearToDefault = event => {
  //   if (event) event.preventDefault();
  //   const canvas = this.imagePreviewCanvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   this.setState({
  //     imgSrc: null,
  //     imgSrcExt: null,
  //     crop: {
  //       x: 100,
  //       y: 100,
  //       width: 100,
  //       height: 150
  //     }
  //   });
  // };

  onUpload = e => {
    e.preventDefault();
    const formData = {
      file: this.state.file,
      caption: this.state.caption
    };

    this.props.uploadAvatar(formData);
  };

  render() {
    const { imgSrc, croppedImageUrl } = this.state;

    return (
      <div className="area-upload">
        {imgSrc !== null ? (
          <div className="area-crop">
            <div className="row justify-content-around">
              <div className="col-md-4">
                <ReactCrop
                  className="dropzone-edit"
                  src={imgSrc}
                  crop={this.state.crop}
                  minWidth={30}
                  minHeight={30}
                  maxWidth={80}
                  maxHeight={80}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              </div>
              <div className="col-md-3">
                <div className="preview-upload-area mx-auto">
                  {/* <canvas ref={this.imagePreviewCanvasRef} /> */}
                  <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                  <p>Preview Avatar</p>
                  <button
                    className="btn btn-info btn-block"
                    onClick={this.handleGetImageResize}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-light btn-block"
                    onClick={this.handleClearToDefault}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 m-auto">
              <Dropzone
                onDrop={this.onDrop}
                accept={acceptedFileTypes}
                multiple={false}
                maxSize={imageMaxSize}
              >
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />

                      <div className="dropzone">
                        <i className="fas fa-camera fa-2x mb-2" />
                        <p>Try dropping some files here, or click to select files to
                    upload.</p>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
        )}
      </div>
    );
  }
}

UploadImage.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default connect(
  null,
  { uploadImage }
)(UploadImage);
