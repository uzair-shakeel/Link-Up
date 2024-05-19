import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Globe from "../../assets/images/Globe.gif";
import "./login.scss";
import { toast } from "react-toastify";
import { InputGroup, Input, Button, InputRightElement } from "@chakra-ui/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [show, setShow] = useState(false);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      toast.success("Login Successfull!");
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
      toast.error("Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="login container-fluid">
      <div className="login-form row  ">
        <div className="left col-md-6 col-12">
          {/*           
          <h1>Link Up.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link> */}
        </div>
        <div className="right col-md-6 col-12">
          {/* <h1
            style={{
              fontSize: "40px",
              fontWeight: "600",
              color: "darkBlue",
              textAlign: "center",
            }}
          >
          Link Up
        </h1> */}
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <img src={Globe} alt="" style={{ width: "80px" }} />
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "500",

                textAlign: "center",
              }}
            >
              Welcome to the{" "}
              <span style={{ fontWeight: "700" }}> Link Up.</span>
            </h1>
          </div>
          <form>
            <Input
              pr="4.5rem"
              style={{ padding: "30px" }}
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter Username"
            />
            <InputGroup size="md" display="flex" alignItems="center">
              <Input
                pr="4.5rem"
                padding={5}
                type={show ? "text" : "password"}
                placeholder="Enter password"
                style={{ padding: "30px" }}
                name="password"
                onChange={handleChange}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  style={{
                    marginRight: "10px",
                    marginTop: "20px",
                    color: "rebeccapurple",
                    background: "transparent",
                  }} // Center vertically
                  marginRight={2}
                  onClick={() => setShow(!show)}
                >
                  {show ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>

            {err && err}
            <button onClick={handleLogin}>Login</button>

            <span>
              Don't you have an account?{" "}
              <Link
                style={{ fontWeight: "500", color: "rebeccapurple" }}
                to="/register"
              >
                Register here
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
