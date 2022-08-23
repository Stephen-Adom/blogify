import { Dialog } from "primereact/dialog";
import { useAppSelector } from "../hooks/hooks";
import { useAppDispatch } from "./../hooks/hooks";
import { toggleChatBox } from "../hooks/reducers/app.reducer";
import { useState } from "react";
import Picker from "emoji-picker-react";
import { Button } from "primereact/button";

export default function ChatBox() {
  const chatBoxStatus = useAppSelector((state) => state.app.chatBoxDialog);
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>("");
  const [openEmojiDialog, setEmojiDialogStatus] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setMessage((current) => current + emojiObject.emoji);
    console.log(emojiObject.emoji);
  };

  const onHide = () => {
    dispatch(toggleChatBox(false));
  };

  const renderFooter = () => {
    return (
      <div className="card-footer d-flex p-0">
        <div className="input-group input-group-solid mr-4">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Search..."
          />
          <span className="mr-3">
            <i className="far fa-image"></i>
          </span>
          <span onClick={() => setEmojiDialogStatus(true)}>
            <i className="far fa-smile icon-md"></i>
          </span>
        </div>

        <div>
          <button className="btn btn-icon btn-custom">
            <i className="pi pi-send"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <div className="card-title d-flex align-items-center">
          <div className="symbol mr-3">
            <img alt="Pic" src={require("../assets/users/100_10.jpg")} />
          </div>
          <div>
            <h6 className="mb-0">Alexandra Burke</h6>
            <span className="d-block text-muted" style={{ fontSize: "12px" }}>
              @alexandra
            </span>
          </div>
        </div>
      </div>
    );
  };

  // RENDER DIALOG FOOTER
  const renderEmojiFooter = () => {
    return (
      <div>
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={() => setEmojiDialogStatus(false)}
          className="p-button-text"
        />
      </div>
    );
  };

  return (
    <Dialog
      className="chat-box"
      header={renderHeader}
      modal={false}
      visible={chatBoxStatus}
      position="bottom-right"
      style={{ width: "33vw" }}
      footer={renderFooter()}
      onHide={() => onHide()}
    >
      <div className="card-body">
        <section className="recipient-message-container">
          <div className="symbol symbol-40 mr-2">
            <img alt="Pic" src={require("../assets/users/100_10.jpg")} />
          </div>
          <div className="recipient-messages">
            <div className="message-bubble">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
              sdfsdfsdfsdf
            </div>
            <div className="message-bubble">Lorem ipsum, dolor sit</div>
            <span
              className="text-muted font-italic font-weight-bold"
              style={{ fontSize: "11px" }}
            >
              04:00 PM
            </span>
          </div>
        </section>

        <section className="sender-message-container">
          <div className="sender-messages">
            <div className="message-bubble">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
              sdfsdfsdfsdf
            </div>
            <div className="message-bubble">Lorem ipsum, dolor sit</div>
            <span
              className="text-muted font-italic font-weight-bold"
              style={{ fontSize: "11px" }}
            >
              04:00 PM
            </span>
          </div>
          <div className="symbol symbol-40 ml-2">
            <img alt="Pic" src={require("../assets/users/100_10.jpg")} />
          </div>
        </section>
      </div>

      {/** START:: EMOJI DIALOG COMPOENT */}
      <Dialog
        header="Select Emoji..."
        visible={openEmojiDialog}
        position="bottom"
        modal
        style={{ width: "28vw" }}
        footer={renderEmojiFooter()}
        onHide={() => setEmojiDialogStatus(false)}
        draggable={false}
        resizable={false}
      >
        <p className="m-0">
          <Picker onEmojiClick={onEmojiClick} />
        </p>
      </Dialog>

      {/** END:: EMOJI DIALOG COMPOENT */}
    </Dialog>
  );
}
