import React from "react";

const TweetMessage = (
    tweet: string
) => {
  return (
    <div className="flex justify-center items-center">
      <p>{tweet}</p>
    </div>
  );
};

export default TweetMessage;
