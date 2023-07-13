import React from 'react';
import { Link, Typography } from '@mui/material';
import { styled } from '@mui/system';

import useGif from '../../assets/how_to_use.gif';

const HowToUseImg = styled('img')`
  display: block;
  margin: 10px auto 10px;
  width: 100%;
  border-radius: 2%;
`;

const StyledTypography = styled(Typography)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FeatList = styled('ul')`
  margin-top: 4px;
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 20px;
`;

const About: React.FC = () => {
  return (
    <>
      <Typography gutterBottom variant="body2">
        nusmods++ is an app for NUS students to build their perfect timetable, even before class registration opens. We have many
        features on the way, including support for your own custom events, and syncing your timetable with friends.
      </Typography>
      {/* <Typography gutterBottom variant="body2">
        Inspired by&nbsp;
        <Link href="https://tdransfield.net/projects/bojangles/" target="_blank">
          Bojangles
        </Link>
        &nbsp;and&nbsp;
        <Link href="https://crossangles.app/" target="_blank">
          Crossangles
        </Link>
        , it was created by CSESoc Projects – a place for student-led projects where you can learn something new, and make some
        friends along the way. nusmods++ is free and <Link href="https:">open-source</Link>.
      </Typography> */}
      <StyledTypography variant="h6">How it works</StyledTypography>
      <Typography gutterBottom variant="body2">
        Select your courses, then drag-and-drop classes to customise your timetable. You can drag clutter (like lectures which you
        aren’t going to watch live) to the unscheduled column. Struggling to find an ideal timetable? Try out our auto-timetabling
        feature!
      </Typography>
      <HowToUseImg src={useGif} alt="how to use gif" />
      <Typography gutterBottom variant="body2">
        Note: It’s a tool for planning your timetable, but you’ll still need to
        officially enroll at&nbsp;
        <Link href="https://myedurec.nus.edu.sg/psc/cs90prd/EMPLOYEE/SA/c/N_STUDENT_RECORDS.N_MRS_START_MD_FL.GBL?Action=U&MD=Y&GMenu=N_STUDENT_RECORDS&GComp=N_MRS_START_NAV_FL&GPage=N_MRS_START_NAV_FL&scname=N_MRS_MODULE_REG_NAV&dup=Y&" target="_blank">
          edurec
        </Link>
        .
      </Typography>
      <StyledTypography variant="h6">Future developments</StyledTypography>
      <FeatList>
        <li> Sync your timetable with friends</li>
      </FeatList>
      <StyledTypography variant="h6">About the team</StyledTypography>
      {/* <Typography gutterBottom variant="body2">
        The current 2023 development team consists of two directors and seven members.
      </Typography> */}
      <Typography gutterBottom variant="body2">
        <strong>Team lead:</strong>
      </Typography>
      <FeatList>
        <li>Shiva, Year 3 Electrical Engineering, NUS</li>
      </FeatList>
      {/* <Typography gutterBottom variant="body2">
        <strong>Members:</strong>
      </Typography> */}
      {/* <FeatList>
        <li>Eklavya Joshi</li>
        <li>Jasmine Tran</li>
        <li>Michael Siu</li>
        <li>Sally Sun</li>
        <li>Shaam Jevan</li>
        <li>Sijin Soon</li>
        <li>Wanning Cai</li>
      </FeatList> */}
      {/* <StyledTypography variant="h6">Disclaimer</StyledTypography>
      <Typography gutterBottom variant="body2">
        While we try our best, nusmods++ is not an official UNSW site, and cannot guarantee data accuracy or reliability.
      </Typography>
      <Typography gutterBottom variant="body2">
        If you find an issue or have a suggestion, please{' '}
        <Link href="https://forms.gle/rV3QCwjsEbLNyESE6" target="_blank">
          let us know
        </Link>
        .
      </Typography> */}
    </>
  );
};

export default About;
