import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import { AppContext } from '../context/AppContext';

const FooterContainer = styled(Box)`
  text-align: center;
  font-size: 12px;
  margin-bottom: 25px;

  & div {
    margin: 1vh 0;
  }
`;

const Footer: React.FC = () => {
  const { lastUpdated } = useContext(AppContext);

  /**
   * @param date Timestamp in Unix time
   * @returns Time relative to the current time, such as "5 minutes" (ago) or "10 hours" (ago)
   */
  const getRelativeTime = (date: number): string => {
    const diff = Date.now() - date;

    const minutes = Math.round(diff / 60000);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    const days = Math.round(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <FooterContainer>
      <div>Designed and built by Shiva. Maintained by Shiva.</div>
      <div>
        <Link target="_blank" href="mailto:E0727167@u.nus.edu">
          Email
        </Link>
        {/* &nbsp;&nbsp;•&nbsp;&nbsp; */}
        {/* <Link target="_blank" href="https://forms.gle/rV3QCwjsEbLNyESE6">
          Feedback
        </Link> */}
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <Link target="_blank" href="https://github.com/shankar-shiv/nusmods_plus_plus">
          Source
        </Link>
      </div>
      {lastUpdated !== 0 && <div>Data last updated {getRelativeTime(lastUpdated)} ago.</div>}
    </FooterContainer>
  );
};

export default Footer;
