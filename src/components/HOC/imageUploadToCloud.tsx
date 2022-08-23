import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { nanoid } from "nanoid";
import React from "react";
import { useAppSelector } from "../../hooks/hooks";
import { Alert } from "../../lib/alerts";
import { storage } from "../../utils/firebase.config";
import { UserBio } from "../../utils/models/post.model";

const imageUploadToCloud = (WrappedComponent) => {
  class ImageUploadToCloud extends React.Component {
    constructor(props: any) {
      super(props);

      this.state = {
        postImages: [],
      };
    }

    userInfo: UserBio = useAppSelector((state) => state.auth.authUserFullBio);

    // CONVERT TO BASE 64;
    getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    handleImageUpload = async (e) => {
      const files = e.target.files;
      let images = [];
      for (let file of files) {
        await this.getBase64(file).then((response) => {
          images.push(response);
        });
      }

      if (images.length === files.length) {
        for (let base64 of images) {
          await this.uploadImageToCloud(base64)
            .then((response: { reference: string; downloadURL: string }) => {
              if (response) {
              }
            })
            .catch((err) => {
              Alert("error", "Image Upload", err);
            });
        }
      }

      // dispatch(stopLoadingProcessing());
    };

    uploadImageToCloud = (base64: string) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(
          storage,
          "images/" + this.userInfo.username + "_" + nanoid()
        );

        //   dispatch(startLoadingProcessing());
        //   dispatch(setLoadingMessage("Uploading Images..."));

        const uploadTask = uploadString(storageRef, base64, "data_url");

        uploadTask
          .then((response) => {
            getDownloadURL(response.ref).then((downloadURL) => {
              resolve({
                reference: response.ref.fullPath,
                downloadURL,
              });
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    render() {
      return <WrappedComponent></WrappedComponent>;
    }
  }

  return ImageUploadToCloud;
};

export default imageUploadToCloud;
