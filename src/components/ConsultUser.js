import React from "react";
import { useParams } from "react-router-dom";
import ProfileView from "./ProfileView";

const ConsultUser = () => {
  const { id } = useParams();
  return <ProfileView id={id} />;
};

export default ConsultUser;
