interface INotification {
  image?: string;
  title: string;
  body: string;
}

const Message = ({ image, title, body }: INotification) => {
  return (
    <>
      <div id="notificationHeader">
        {/* image is optional */}
        {image && (
          <div id="imageContainer">
            <img src={image} width={100} />
          </div>
        )}
        <span>{title}</span>
      </div>
      <div id="notificationBody">{body}</div>
    </>
  );
};

export default Message;
