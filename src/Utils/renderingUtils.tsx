import React from 'react';
import { IDescriptionSegment, ITeam, IUser } from '../Types/Game';
import MemberCard from '../Components/UserCard/MemberCard';
import Tooltip from '@mui/material/Tooltip';

// Helper function to find a member by ID across all teams
const getMemberById = (
  memberId: string,
  allTeams: ITeam[]
): IUser | undefined => {
  for (const team of allTeams) {
    const member = team.members.find(m => m.id === memberId);
    if (member) return member;
  }
  return undefined;
};

// Helper function to find a member by name across all teams
const getMemberByName = (
  memberName: string,
  allTeams: ITeam[]
): IUser | undefined => {
  for (const team of allTeams) {
    const member = team.members.find(m => m.name === memberName);
    if (member) return member;
  }
  return undefined;
};

/**
 * Renders an array of description segments with specific styling and tooltips for users.
 * @param description - The array of description segments.
 * @param allTeams - Array of all teams (including defeated) to find member details.
 * @returns An array of React nodes representing the rendered description.
 */
export const renderSegmentedDescription = (
  description: IDescriptionSegment[],
  allTeams: ITeam[]
): React.ReactNode[] => {
  if (!description || description.length === 0) return [''];

  return description.map((segment, index) => {
    switch (segment.type) {
      case 'team':
        return (
          <span
            key={`${segment.id || 'team'}-${index}`}
            className="text-blue-300 font-semibold cursor-pointer hover:underline"
            // Potentially add onClick to show team details later if needed
          >
            {segment.value}
          </span>
        );
      case 'user':
        const member = segment.id
          ? getMemberById(segment.id, allTeams)
          : getMemberByName(segment.value, allTeams);

        if (member) {
          return (
            <Tooltip
              key={`${segment.id || segment.value}-${index}`}
              title={<MemberCard member={member} />}
              placement="top"
              sx={{
                padding: '0',
                fontSize: 'inherit',
              }}
              slotProps={{
                tooltip: {
                  sx: {
                    padding: '0',
                    fontSize: 'inherit',
                  },
                },
              }}
            >
              <span className="text-teal-300 font-medium cursor-pointer hover:underline">
                {segment.value}
              </span>
            </Tooltip>
          );
        } else {
          // Fallback if member not found
          return (
            <span key={index} className="text-teal-300 font-medium">
              {segment.value}
            </span>
          );
        }
      case 'text':
      default:
        return segment.value;
    }
  });
};
