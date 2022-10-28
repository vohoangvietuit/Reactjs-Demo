export const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const imageMaxSize = 2 * 1024 * 1024; // 2MB
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim();
});
export const verifyFile = files => {
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

// export const fileToBase64 = currentFile => {
//   const myFileItemReader = new FileReader();
//   myFileItemReader.addEventListener(
//     'load',
//     () => {
//       const myResult = myFileItemReader.result;
//       return myResult;
//     },
//     false
//   );

//   myFileItemReader.readAsDataURL(currentFile);
// };
