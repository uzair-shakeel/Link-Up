import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Avatar from "../../assets/avatar.jpg";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post._id], () =>
    makeRequest.get("/likes?postId=" + post._id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post._id);
      return makeRequest.post("/likes", { postId: post._id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser._id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post._id);
    toast.success("Post Deleted Successfull");
  };

  const isVideo = (fileName) => {
    const videoExtensions = [".mp4", ".mov", ".mkv", ".avi", ".wmv", ".avchd", ".webm", ".flv", ".m4v"];
    return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {post.userId.profilePic ? (
              <img src={"/upload/" + post.userId.profilePic} alt="" />
            ) : (
              <img src={Avatar} alt="Default Avatar" />
            )}
            <div className="details">
              <Link
                to={`/profile/${post.userId._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.userId.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId._id === currentUser._id && (
            <button className="btn" onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && isVideo(post.img) ? (
            <video className="media" controls>
              <source src={"/upload/" + post.img} type={`video/${post.img.split('.').pop()}`} />
            </video>
          ) : (
            <img className="media" src={"/upload/" + post.img} alt="" />
          )}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser._id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && <Comments postId={post._id} />}
      </div>
    </div>
  );
};

export default Post;
