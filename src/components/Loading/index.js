import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = props => {
  return (
    <div className="loading">
      <ClipLoader loading={true} size={30} color={"lightgreen"}/> 
    </div>
  );
};

export default Loading;
