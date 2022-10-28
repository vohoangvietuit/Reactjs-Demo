import React from 'react';
import UploadImage from 'shared/components/UploadImage/UploadImage';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import { uploadUserAvatar } from 'store/actions/authAction';

function ChangeAvatar() {
  const dispatch = useDispatch();
  let history = useHistory();

  onChangeAvatar = fileImage => {
    dispatch(uploadUserAvatar(fileImage))
      .then(res => {
        history.push('/profile');
        toast.success('Update successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        });
      })
      .catch(err =>
        toast.error('Error can not update, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      );
  };

  return (
    <div className="change-avatar">
      <h1 className="display-5 text-center mb-5">Change avatar</h1>
      <UploadImage onChange={this.onChangeAvatar} />
      <ToastContainer />
    </div>
  );
}

export default ChangeAvatar;
