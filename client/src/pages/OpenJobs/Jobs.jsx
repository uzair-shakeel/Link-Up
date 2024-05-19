import Stories from "../../components/stories/Stories";
import Jobs from "../../components/openJobs/Jobs";
import Share from "../../components/share/Share";
import JobPost from "../../components/JobPost/JobPost";
import "./Jobs.scss";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  return (
    <div className="home container-fluid px-4  py-4" style={{ height: "100%" }}>
      {/* <JobPost /> */}
      <Jobs />
    </div>
  );
};

export default Home;
