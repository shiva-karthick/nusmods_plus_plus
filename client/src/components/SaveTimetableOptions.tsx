import React, { useContext, useEffect, useRef, useCallback } from "react";
import PropTypes from "react";

import {
  Box,
  Grid,
  Paper,
  ListItem,
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

import Button from "@mui/material/Button";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as Sentry from "@sentry/react";
import getCourseInfo from "../api/getCourseInfo";
import getCoursesList from "../api/getCoursesList";
import Alerts from "./Alerts";
import Controls from "./controls/Controls";
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";
import Timetable from "./timetable/Timetable";
import { contentPadding, darkTheme, lightTheme } from "../constants/theme";
import {
  daysLong,
  getAvailableTermDetails,
  getDefaultEndTime,
  getDefaultStartTime,
  invalidYearFormat,
  unknownErrorMessage,
} from "../constants/timetable";
import { AppContext } from "../context/AppContext"; // context for storing app settings
import { CourseContext } from "../context/CourseContext"; // context for storing course data
import useColorMapper from "../hooks/useColorMapper"; // custom hooks for assigning colours to courses
import useUpdateEffect from "../hooks/useUpdateEffect"; // custom hooks for updating local storage
import NetworkError from "../interfaces/NetworkError";
import {
  Activity,
  ClassData,
  CourseCode,
  CourseData,
  InInventory,
  SelectedClasses,
} from "../interfaces/Periods";
import { setDropzoneRange, useDrag } from "../utils/Drag";
import { downloadIcsFile } from "../utils/generateICS";
import storage from "../utils/storage";
import { StyledControlsButton } from "../styles/ControlStyles";
import { DropdownButton } from "../styles/CustomEventStyles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled, alpha } from "@mui/material/styles";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

const ICSButton = styled(Button)`
  && {
    min-width: 250px;
    margin: 2vh auto;
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: #ffffff;
    &:hover {
      background-color: #598dff;
    }
  }
`;

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

// export const SaveTimetableOptions = ({ref}) => {
export const SaveTimetableOptions = ({
  customRef,
}: {
  customRef: React.RefObject<HTMLDivElement>;
}) => {
  const {
    is12HourMode,
    isDarkMode,
    isSquareEdges,
    isShowOnlyOpenClasses,
    isDefaultUnscheduled,
    isHideClassInfo,
    isHideExamClasses,
    isConvertToLocalTimezone,
    setAlertMsg,
    setErrorVisibility,
    days,
    term,
    year,
    setDays,
    earliestStartTime,
    setEarliestStartTime,
    latestEndTime,
    setLatestEndTime,
    setTerm,
    setYear,
    firstDayOfTerm,
    setFirstDayOfTerm,
    setTermName,
    setTermNumber,
    setCoursesList,
    setLastUpdated,
  } = useContext(AppContext);

  // The useContext hook allows you to access the state of a context object from within a component.
  // The useContext hook accepts a context object (the value returned from React.createContext) and returns the current context value for that context.
  const {
    selectedCourses,
    setSelectedCourses,
    selectedClasses,
    setSelectedClasses,
    createdEvents,
    setCreatedEvents,
  } = useContext(CourseContext);

  /**
   * Attemps callback() several times before raising error. Intended for unreliable fetches
   */
  const maxFetchAttempts: number = 6;
  const fetchCooldown: number = 120; // milliseconds
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const fetchReliably = async (callback: () => Promise<void>) => {
    for (let attempt: number = 1; attempt <= maxFetchAttempts; attempt++) {
      try {
        await callback();
        break;
      } catch (e) {
        if (attempt !== maxFetchAttempts) {
          await sleep(fetchCooldown); // chill for a while before retrying
          continue;
        }
        if (e instanceof NetworkError) {
          setAlertMsg(e.message);
        } else {
          setAlertMsg(unknownErrorMessage);
        }
        setErrorVisibility(true);
      }
    }
  };

  useEffect(() => {
    /**
     * Retrieves term data from the scraper backend, nusmods API
     */
    const fetchTermData = async () => {
      const termData = await getAvailableTermDetails();
      let { term, termName, termNumber, year, firstDayOfTerm } = termData;
      setTerm(term);
      setTermName(termName);
      setTermNumber(termNumber);
      setYear(year);
      setFirstDayOfTerm(firstDayOfTerm);
    };

    fetchReliably(fetchTermData);
  }, []);

  // Button stuff material UI
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Save image *** Start ***
  const onButtonClick = useCallback(() => {
    if (customRef.current === null) {
      return;
    }

    toPng(customRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my_timetable.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [customRef]);
  // Save image *** End ***

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined} // aria-controls is used to link the button to the menu
        aria-haspopup="true" // aria-haspopup is used to indicate that the button opens a menu
        aria-expanded={open ? "true" : undefined} // aria-expanded is used to indicate that the menu is open
        variant="contained" // variant is used to style the button
        disableElevation // disableElevation removes the box shadow
        onClick={handleClick} // onClick is used to handle the opening of the menu
        endIcon={<KeyboardArrowDownIcon />} // endIcon is used to display an icon at the end of the button
      >
        Download
      </Button>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button", // aria-labelledby is used to link the menu to the button
        }}
        anchorEl={anchorEl} // anchorEl is used to position the menu
        open={open} // open is used to control the visibility of the menu
        onClose={handleClose} // onClose is used to handle the closing of the menu
      >
        <MenuItem
          onClick={onButtonClick}
          disableRipple
        >
          <ImageIcon />
          Image (.png)
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("PDF");
          }}
          disableRipple
        >
          <PictureAsPdfIcon />
          PDF (.pdf)
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() =>
            downloadIcsFile(
              selectedCourses,
              createdEvents,
              selectedClasses,
              firstDayOfTerm
            )
          }
          disableRipple
        >
          <CalendarMonthIcon />
          iCalendar File (.ics)
        </MenuItem>
      </StyledMenu>
    </div>
  );
};
