import "./LargNavbar.css";
import { Link, NavLink } from "react-router-dom";
import $ from "jquery";
import { BiSolidCastle } from "react-icons/bi";
import { FaUserLarge } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { FaRegCircleUser } from "react-icons/fa6";
import { BRAND_NAME, LOGO_MARK } from "../../../utils/brand";
import WalletConnectButton from "../../wallet/WalletConnectButton";

const navLinks = [
  { name: "About", link: "/about" },
  { name: "Games", link: "/nfts" },
  { name: "Staking", link: "/staking" },
  { name: "Careers", link: "/careers" },
  { name: "Roadmap", link: "/home#roadmap" },
];

const LargNavbar = ({ rowData, setData }) => {
  const HandelNaveMenu = () => {
    $(".userMenu").toggleClass("show");
  };

  return (
    <nav className="navbar navbar-expand-lg tv-navbar lb-navbar" id="Lnav">
      <div className="container-fluid">
        <Link className="tv-brand d-flex align-items-center gap-2 text-decoration-none" to="/home">
          <img src={LOGO_MARK} alt={`${BRAND_NAME} logo`} className="tv-brand-icon" />
          <span className="tv-brand-name">{BRAND_NAME}</span>
        </Link>

        <ul className="tv-nav-links list-unstyled d-none d-lg-flex m-0">
          {navLinks.map((item) => (
            <li key={item.name}>
              <NavLink to={item.link} className="tv-nav-link">
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center">
            <WalletConnectButton />
          </div>
          {rowData.Access.haveaccess ? (
            <div className="userToolsComponant">
              <div
                className="btnTempUser d-flex justify-content-center align-items-center"
                onClick={HandelNaveMenu}
              >
                {rowData.Access.accountInfo.userAvatar ? (
                  <img src={rowData.Access.accountInfo.userAvatar} alt="user" />
                ) : (
                  <div className="parIcon d-flex justify-content-center align-items-center">
                    <FaRegCircleUser className="Icon" />
                  </div>
                )}
              </div>
              <div className="userMenu">
                <div className="triangle-up" />
                <NavLink to="/home" className="ps-2 d-flex align-items-center gap-2 my-2 menuButton" onClick={HandelNaveMenu}>
                  <BiSolidCastle /><span>Home</span>
                </NavLink>
                <NavLink to="/nftlab" className="ps-2 d-flex align-items-center gap-2 my-2 menuButton" onClick={HandelNaveMenu}>
                  <ImLab /><span>Creator Lab</span>
                </NavLink>
                <NavLink to="/account" className="ps-2 d-flex align-items-center gap-2 my-2 menuButton" onClick={HandelNaveMenu}>
                  <FaUserLarge /><span>Account</span>
                </NavLink>
                <div
                  className="ps-2 d-flex align-items-center gap-2 my-2 menuButton"
                  onClick={() =>
                    setData((prvData) => ({
                      ...prvData,
                      Access: {
                        ...prvData.Access,
                        haveaccess: "",
                        accountInfo: {
                          userAvatar: "",
                          userName: "",
                          userEmail: "",
                          userLinks: {
                            FaceBookLink: "",
                            disCordLink: "",
                            youtubeLink: "",
                            xLink: "",
                            instgramLink: "",
                          },
                          userBio: "",
                          userPassword: "",
                        },
                      },
                    }))
                  }
                >
                  <FaSignOutAlt /><span>Logout</span>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/signup" className="tv-btn-nav">Get Started</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LargNavbar;
