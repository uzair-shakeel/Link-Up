import React, { useContext, useState } from "react";
import Job from "../job/Job";
import "./jobs.scss";
import { useQuery } from "@tanstack/react-query";
import { DarkModeContext } from "../../context/darkModeContext";
import { BASE_URL } from "../../axios";

const Posts = ({}) => {
  const { darkMode } = useContext(DarkModeContext);
  const { isLoading, error, data } = useQuery(["closed"], async () => {
    const response = await fetch(`${BASE_URL}/jobs/closed`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();
    return responseData;
  });

  return (
    <div className={`posts ${darkMode ? "text-light" : ""}`}>
      <h3>Closed Jobs</h3>
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((job) => <Job job={job} key={job._id} />)}
    </div>
  );
};

export default Posts;
