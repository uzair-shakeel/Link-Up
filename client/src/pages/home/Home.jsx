import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);
  return (
    <div className="home container-fluid px-4  pb-4" style={{ height: "100%" }}>
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
