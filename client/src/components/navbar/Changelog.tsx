import React from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

type Change = { date: String; changes: String[] };

const changelog: Change[] = [
  {
    date: 'July, 2023',
    changes: ['Multiple timetables can be created by a user at the same time', 'Able to authenticate anonymously using Firebase'],
  },
  {
    date: 'July, 2023',
    changes: ['Synced data with Nusmods API'],
  },
  {
    date: 'July, 2023',
    changes: ['Can edit, copy, paste, duplicate and delete events by right clicking'],
  },
  {
    date: 'July, 2023',
    changes: ['Event can be created and shared between different users via a link'],
  },
  {
    date: 'July, 2023',
    changes: ['Added a clear button that completely resets the state of the timetable'],
  },
  {
    date: 'July, 2023',
    changes: ['Event can be created with a double click on the grid you want it to be created in'],
  },
  {
    date: 'July, 2023',
    changes: ['Custom events now encompass general and tutoring events'],
  },
  {
    date: 'July, 2023',
    changes: ['Autotimetabling now schedules around your custom events'],
  },
  {
    date: 'July, 2023',
    changes: ['Added ability to clone a created custom event'],
  },
  {
    date: 'July, 2023',
    changes: ['Backspace can be used to delete courses in the course selection search bar'],
  },
  {
    date: 'July, 2023',
    changes: ["Added setting to convert the timetable to the user's local timezone"],
  },
  {
    date: 'July, 2023',
    changes: ['Added ability to create a custom event that happens on multiple days'],
  },
  {
    date: 'June, 2023',
    changes: ['Added setting toggle to hide exam classes'],
  },
  {
    date: 'June, 2023',
    changes: ['Changed icon to open expanded view'],
  },
  {
    date: 'June, 2023',
    changes: ['Added support for custom user events'],
  },
  {
    date: 'June, 2023',
    changes: ['Option to hide full classes changed to hide all non-open classes (both full and on-hold)'],
  },
  {
    date: 'June, 2023',
    changes: ['Clashing classes are now displayed side by side instead of stacked on top of each other'],
  },
  {
    date: 'June, 2023',
    changes: [
      'Added expanded class view to see more details about a class',
      'Moved selecting between classes running at the same time to inside expanded class view',
    ],
  },
  {
    date: 'June, 2023',
    changes: ['Removed ability to sort search results alphabetically'],
  },
  {
    date: 'June, 2023',
    changes: [
      'Added autotimetabling',
      'Fixed bug which caused the timetable scrollbar to flash when changing between light and dark mode',
    ],
  },
  {
    date: 'June, 2023',
    changes: ['Arrows to select different class now appear on all instances of a class, not just the first one'],
  },
  {
    date: 'May, 2023',
    changes: ['Added history (undo, redo, reset)'],
  },
  {
    date: 'May, 2023',
    changes: ['Made privacy page prettier'],
  },
  {
    date: 'May 28, 2023',
    changes: ['Added icons to differentiate between UG and PG classes'],
  },
  {
    date: 'May 27, 2023',
    changes: ['Added DST support for ICS generation'],
  },
  {
    date: 'May 26, 2023',
    changes: ['Added ability to sort search results alphabetically', 'Hid Saturday column if courses had no Saturday classes'],
  },
  {
    date: 'May, 2023',
    changes: ['Bumped term number', 'Added icons to indicate course delivery mode', 'Made ICS save button prettier'],
  },
  {
    date: 'May, 2023',
    changes: ['Added ICS saving'],
  },
  {
    date: 'May, 2023',
    changes: ['Added ability to select between classes running at the same time'],
  },
  {
    date: 'May, 2023',
    changes: ['Added icon to indicate when class is full', 'Updated class colours'],
  },
  {
    date: 'May, 2023',
    changes: ['Added about us modal and settings modal'],
  },
];

const StyledTypography = styled(Typography)`
  padding-bottom: 5px;
`;

const Changelog: React.FC = () => {
  return (
    <>
      <Timeline>
        {changelog.map(({ date, changes }, idx) => (
          <TimelineItem key={idx}>
            <TimelineOppositeContent color="text.primary" sx={{ maxWidth: '120px' }}>
              {date}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {changes.map((change, idx) => (
                <StyledTypography key={idx}>{change}</StyledTypography>
              ))}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
};

export default Changelog;
