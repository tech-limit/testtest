import "./LogIn.css";
import { LOGIN_MASCOT } from "../../../utils/brand";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

const LogIn = ({ Data, setData }) => {
  const [userInput, setUserInput] = useState({
    userName: "",
    passWord: "",
  });
  const [messageInbutHandler, setMessageInbutHandler] = useState({
    InbutNotFound: "",
  });

  const HandelInput = async (event) => {
    event.preventDefault();
    const emailOrName = userInput.userName.trim();
    const password = userInput.passWord;

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrName.includes("@")
            ? emailOrName
            : Data.accountInfo.userEmail || emailOrName,
          password,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body?.token) {
        try {
          localStorage.setItem("lb_token", body.token);
        } catch {
          /* ignore */
        }
        setData((prvData) => ({
          ...prvData,
          Access: {
            ...prvData.Access,
            haveaccess: "true",
          },
        }));
        return;
      }
    } catch {
      /* fall through to local demo auth */
    }

    const localUser = Data.accountInfo.userName || Data.accountInfo.userEmail;
    const matchesLocal =
      emailOrName &&
      password &&
      (emailOrName === Data.accountInfo.userName ||
        emailOrName === Data.accountInfo.userEmail) &&
      password === Data.accountInfo.userPassword;

    if (matchesLocal || (emailOrName && password && !localUser)) {
      setData((prvData) => ({
        ...prvData,
        Access: {
          ...prvData.Access,
          haveaccess: "true",
          accountInfo: {
            ...prvData.Access.accountInfo,
            userName: prvData.Access.accountInfo.userName || emailOrName,
            userEmail:
              prvData.Access.accountInfo.userEmail ||
              (emailOrName.includes("@") ? emailOrName : ""),
            userPassword: prvData.Access.accountInfo.userPassword || password,
          },
        },
      }));
    } else {
      setMessageInbutHandler({
        InbutNotFound: true,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Limit Break | Log In</title>
        <meta name="description" content="Log in to Limit Break V2" />
      </Helmet>
      <section id="Login" className="pt-0 pt-lg-1 pb-4">
        <div className="container">
          <div className="row my-5 mx-2">
            <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center order-1 order-lg-0 my-4">
              <div className="LoginBudy px-lg-4">
                <div className="text-center FORMhED">
                  <span className="F1 d-block">Welcome</span>
                  <span className="F4">
                    We are glad to see you back with us
                  </span>
                </div>
                <form onSubmit={HandelInput} className="mt-3">
                  {messageInbutHandler.InbutNotFound ? (
                    <div
                      style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: ".8rem",
                      }}
                    >
                      <span>*username or password not match try again</span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="d-flex justify-content-center mt-3">
                    <div className="w-100 position-relative inputComponant">
                      <input
                        className="w-100 py-2"
                        type="text"
                        required
                        minLength={6}
                        value={userInput.userName}
                        onChange={(inputValue) =>
                          setUserInput({
                            ...userInput,
                            userName: inputValue.target.value,
                          })
                        }
                      />
                      {!userInput.userName ? (
                        <div className="F4 inputContant">
                          <FiUser className="FiUser" />
                          <span>Username or Email</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-100 position-relative inputComponant">
                      <input
                        className="w-100 py-2"
                        type="password"
                        required
                        minLength={8}
                        value={userInput.passWord}
                        onChange={(inputValue) =>
                          setUserInput({
                            ...userInput,
                            passWord: inputValue.target.value,
                          })
                        }
                      />
                      {!userInput.passWord ? (
                        <div className="F4 inputContant">
                          <FiLock className="FiUser" />
                          <span>Password</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-100 position-relative buttonInputComponant py-2">
                      <span>NEXT</span>
                    </button>
                  </div>
                </form>
                <div className="hrStyle gap-1">
                  <span className="F1">Login</span>
                  <span className="F4">with Others</span>
                </div>
                <div>
                  <div className="d-flex justify-content-center mt-4">
                    <div className="w-100 sochialButtonComponant py-2 gap-2">
                      <FaGoogle className="sochialIcon my-1" />
                      <div className="sochialButtonComponantTitle gap-1">
                        <span className="F4">Login with</span>
                        <span className="F1">Google</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <div className="w-100 sochialButtonComponant py-2 gap-2">
                      <FaSquareFacebook className="sochialIcon" />
                      <div className="sochialButtonComponantTitle gap-1">
                        <span className="F4">Login with</span>
                        <span className="F1">Facebook</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hrStyle gap-1 mt-4">
                  <Link to="/signup">
                    <span className="F1">SingUp</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 order-0 order-lg-1 formeImg my-4">
              <img
                src={LOGIN_MASCOT}
                alt="Limit Break V2"
                className="login-hero-img"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;
