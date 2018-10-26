import React from "react";
import image from "../data/image.js";
import { Link } from "react-router-dom";

const List = props => {
  return (
    <li className="list">
      {!props.data.avatar ? (
        <img src={image} className="li-avatar" />
      ) : (
        <img src={props.data.avatar} className="li-avatar" />
      )}
      <div className="li-mid">
        <Link to={`/detail/${props.data._id}`}>
          <div className="li-name">
            {props.data.firstName} {props.data.lastName}
          </div>
        </Link>
        <div className="li-title">{props.data.title}</div>
      </div>
      <div className="li-reports">{props.data.directReports.length}</div>
      <Link to={`/detail/${props.data._id}`}>
        <i className="fas fa-angle-right" id="li-arrow" />
      </Link>
    </li>
  );
};

export default List;
