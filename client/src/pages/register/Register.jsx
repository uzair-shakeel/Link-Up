import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { toast } from "react-toastify";
import Globe from "../../assets/images/Globe.gif";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { InputGroup, Input, Button, InputRightElement } from "@chakra-ui/react";
import { BASE_URL } from "../../axios";

const Register = () => {
  const [show, setShow] = useState(false);

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/register`, inputs);
      toast.success("Registration Successful.");
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
      toast.error("Registration Failed. Please check your inputs.");
    }
  };

  return (
    <div className="register container-fluid">
      <div className="register-form row">
        <div className="left col-md-6 col-12">
          {/* <h1>Link Up.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link> */}
        </div>
        <div className="right col-md-6 col-12">
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <img src={Globe} alt="" style={{ width: "80px" }} />
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "500",

                textAlign: "center",
              }}
            >
              Register to explore{" "}
              <span style={{ fontWeight: "700" }}> Link Up.</span>
            </h1>
          </div>
          <form>
            <Input
              pr="4.5rem"
              style={{ padding: "30px" }}
              placeholder="Enter Name"
              name="name"
              onChange={handleChange}
            />
            <Input
              pr="4.5rem"
              style={{ padding: "30px" }}
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter Username"
            />
            <Input
              pr="4.5rem"
              style={{ padding: "30px" }}
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleChange}
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
            <button onClick={handleClick}>Register</button>
            <span>
              Already have an account?{" "}
              <Link
                style={{ fontWeight: "500", color: "rebeccapurple" }}
                to="/login"
              >
                Login here
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
