import Jobs from "../../components/closedJobs/Jobs";
import "./Jobs.scss";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  return (
    <div className="home container-fluid px-4  py-4" style={{ height: "100%" }}>
      <Jobs />
    </div>
  );
};

export default Home;
