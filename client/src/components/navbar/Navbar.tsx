import React, { useContext, useState } from "react";
import {
  Description,
  Info,
  Security,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";

import notanglesLogo from "../../assets/notangles_1.png";
import notanglesLogoGif from "../../assets/notangles.gif";
import { ThemeType } from "../../constants/theme";
import { AppContext } from "../../context/AppContext";

import About from "./About";
import Changelog from "./Changelog";
import CustomModal from "./CustomModal";
import Privacy from "./Privacy";
import Settings from "./Settings";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import Friends from "@mui/icons-material/People";
import User from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const LogoImg = styled("img")`
  height: 46px;
  margin-right: 12.5px;
  margin-top: -2px;
  margin-left: -11.5px;
`;

const NavbarBox = styled("div")`
  flex-grow: 1;
  position: fixed; /* the original code had fixed, but need to experiment on how to display on mobile*/
  margin-left: 0px;
  z-index: 1201; /* overriding https://material-ui.com/customization/z-index/ */
`;

const StyledNavBar = styled(AppBar)`
  background: ${({ theme }) => theme.palette.primary.main};
  z-index: 1201;
`;

const NavbarTitle = styled(Typography)`
  flex-grow: 1;
  z-index: 1201;
`;

const Weak = styled("span")`
  font-weight: 300;
  opacity: 0.8;
  margin-left: 15px;
  font-size: 90%;
  vertical-align: middle;
  position: relative;
  bottom: 1px;
  z-index: 1201;
`;

const Navbar: React.FC = () => {
  const [currLogo, setCurrLogo] = useState(notanglesLogo);
  const { term, termName, year } = useContext(AppContext);
  const theme = useTheme<ThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };

  return (
    <NavbarBox>
      <StyledNavBar enableColorOnDark position="fixed">
        <Toolbar>
          <LogoImg
            src={currLogo}
            onMouseOver={() => setCurrLogo(notanglesLogoGif)}
            onMouseOut={() => setCurrLogo(notanglesLogo)}
          />
          <NavbarTitle variant="h6">
            nusmods++
            <Weak>{isMobile ? term : termName.concat(", ", year)}</Weak>
          </NavbarTitle>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1em",
              justifyContent: "flex-end",
            }}
          >
            {/* <Button
              variant="contained"
              style={{ backgroundColor: "#3f51b5", color: "white" }}
              startIcon={<Friends />}
              // onClick={() => alert("Friends Button Clicked")}
            >
              Friends
            </Button>

            <Button
              variant="contained"
              style={{ backgroundColor: "#4caf50", color: "white" }}
              startIcon={<AddIcon />}
              // onClick={() => alert("Add Friends Button Clicked")}
            >
              Add Friends
            </Button> */}

            <Button
              variant="contained"
              style={{ backgroundColor: "#f44336", color: "white" }}
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Logout
            </Button>
          </div>

          <CustomModal
            title="About"
            showIcon={<Info />}
            description={"nusmods++: an improved version of NUSMods"}
            content={<About />}
          />
          <CustomModal
            title="Changelog"
            showIcon={<Description />}
            description={"Changelog"}
            content={<Changelog />}
          />
          <CustomModal
            title="Privacy"
            showIcon={<Security />}
            description={"Application Privacy Statement"}
            content={<Privacy />}
          />
          <CustomModal
            title="Settings"
            showIcon={<SettingsIcon />}
            description={"Settings"}
            content={<Settings />}
          />
        </Toolbar>
      </StyledNavBar>
    </NavbarBox>
  );
};

export default Navbar;
