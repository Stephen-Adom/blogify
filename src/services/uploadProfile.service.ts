import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utils/firebase.config";

export function UploadProfile(file: File, userInfo: any) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, "profiles/" + userInfo.username);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    // + "_" + format(new Date(), "t")

    console.log(storageRef, "STORAGE REF");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            // dispatch(
            //   updateLoadingCount(
            //     Math.round(
            //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            //     )
            //   )
            // );
            console.log(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            reject(error);
            break;
          case "storage/canceled":
            // User canceled the upload
            reject(error);
            break;

          // ...

          case "storage/unknown":
            reject(error);
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({
            reference: uploadTask.snapshot.ref.fullPath,
            downloadURL,
          });
        });
      }
    );
  });
}
