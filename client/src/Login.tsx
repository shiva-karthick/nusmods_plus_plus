import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

// Start of MUI imports
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
  IconButton,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Input from "@mui/material/Input";
import { styled } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormControl, FormLabel } from "@mui/material";
// End of MUI imports

import * as Sentry from "@sentry/react";
import getCourseInfo from "./api/getCourseInfo";
import getCoursesList from "./api/getCoursesList";
import Alerts from "./components/Alerts";
import Controls from "./components/controls/Controls";
import Footer from "./components/Footer";
import Navbar from "./components/navbar/Navbar";
import { TimetableTabs } from "./components/timetableTabs/TimetableTabs";
import Timetable from "./components/timetable/Timetable";
import { contentPadding, darkTheme, lightTheme } from "./constants/theme";
import {
  daysLong,
  getAvailableTermDetails,
  getDefaultEndTime,
  getDefaultStartTime,
  invalidYearFormat,
  unknownErrorMessage,
} from "./constants/timetable";
import { AppContext } from "./context/AppContext"; // context for storing app settings
import { CourseContext } from "./context/CourseContext"; // context for storing course data
import useColorMapper from "./hooks/useColorMapper"; // custom hooks for assigning colours to courses
import useUpdateEffect from "./hooks/useUpdateEffect"; // custom hooks for updating local storage
import NetworkError from "./interfaces/NetworkError";
import {
  Activity,
  ClassData,
  CourseCode,
  CourseData,
  InInventory,
  SelectedClasses,
} from "./interfaces/Periods";
import { setDropzoneRange, useDrag } from "./utils/Drag";
import { downloadIcsFile } from "./utils/generateICS";
import storage from "./utils/storage";
import { SaveTimetableOptions } from "./components/SaveTimetableOptions";
import notanglesLogo from "./assets/notangles_1.png";
import notanglesLogoGif from "./assets/notangles.gif";
import bgImage from "./assets/background.jpg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InputAdornment from "@mui/material/InputAdornment";
import Password from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SendIcon from "@mui/icons-material/Done";

// Firebase stuff
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./api/config";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

// import firebase auth
import { getAuth, signInAnonymously } from "firebase/auth";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firebase = getFirestore(firebaseApp);
const db = collection(firebase, "test");
const dbUserDoc = doc(db, "user");

const LogoImg = styled("img")`
  margin: 0 auto; /* This centers the image */
`;

const LoginTitle = styled(Typography)`
  // center the text
  text-align: start;
  // bold the text
  font-weight: bold;
`;

export const Login: React.FC = () => {
  const [currLogo, setCurrLogo] = useState(notanglesLogo);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userNameTaken, setUserNameTaken] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  let navigate = useNavigate();

  // onSnapshot(db, (snapshot) => {
  //   let data = snapshot.docs.map((doc) => doc.data());
  //   // check if data is empty
  //   const appData = useContext(AppContext);
  //   const courseData = useContext(CourseContext);
  //   setDoc(dbUserDoc, { appData, courseData });
  //   data.push(appData, courseData)
  //   console.log("Current data: ", appData);
  // });
  

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Username: " + username);
    console.log("Password: " + password);

    const result = signInAnonymously(auth);
    navigate("/home"); // redirect to home page
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        // width : "100%",
        // height: "0%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid
        height="100vh"
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        // align the items column
        direction="column"
        container // this is a grid container
        spacing={2} // this is the spacing between grid items
        justifyContent="center"
        alignContent={"center"}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <LogoImg
          src={currLogo}
          onMouseOver={() => setCurrLogo(notanglesLogoGif)}
          onMouseOut={() => setCurrLogo(notanglesLogo)}
        />
        <LoginTitle variant="h6">Welcome to NUSMODS++</LoginTitle>

        <p>
          {" "}
          Developed and Maintained by Shiva, Year 4 Electrical Engineering, NUS
        </p>

        <br></br>

        {/* {!userNameTaken ? (
          <TextField
            id="username"
            label="Enter Username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
        ) : (
          <TextField
            id="username"
            label="Enter Username"
            error
            helperText="Username is taken"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
        )} */}

        {/* <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            value={password}
          />
        </FormControl> */}
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          Enter
        </Button>
      </Grid>
    </Box>
  );
};
