import * as React from "react";
import { Component } from "react";
import { useUserContext } from "../Context/userContext";
import { Outlet, Navigate } from "react-router-dom";
import Tutorial from "../components/Tutorial/Tutorial";

function Protected() {
  const [showMsg, setShowMsg] = React.useState(true);
  const { user, isFetching } = useUserContext();
  if (isFetching) return <Tutorial setShowMsg={() => setShowMsg(false)} />;

  return user != null ? <Outlet /> : <Navigate to={"/login"} />;
}

export default Protected;
