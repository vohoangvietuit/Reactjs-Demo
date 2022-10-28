import axios from 'axios';

export const uploadFormData = formData => dispatch => {
  let data = new FormData();

  data.append('photo', formData.file);
  data.append('caption', formData.caption);

  // for (let item of data.entries()) {
  //   console.log('item form', item);
  // }

  axios
    .post('/api/upload/image', data)
    .then(res => console.log('success', res))
    .catch(err => console.log('err', err));
};

export const uploadImage = fileImage => dispatch => {
  let data = new FormData();

  data.append('photo', fileImage);

  for (let item of data.entries()) {
    console.log('fileImage', item);
  }

  axios
    .post('/api/upload/image', data)
    .then(res => console.log('success', res))
    .catch(err => console.log('err', err));
};
