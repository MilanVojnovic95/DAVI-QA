import styled from 'styled-components';
import { Heading } from 'old-components/Guilds/common/Typography';
import { Link } from 'react-router-dom';
import { Button } from 'old-components/Guilds/common/Button';
import { Box } from 'Components/Primitives/Layout';

export const ProposalsList = styled(Box)`
  margin-top: 1rem;
`;

export const ProposalListWrapper = styled.div`
  height: 50vh;
  @media only screen and (min-width: 768px) {
    height: 75vh;
  }
`;

export const StyledHeading = styled(Heading)`
  margin-top: 32px;
  margin-bottom: 20px;
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
`;

export const StyledButton = styled(Button)`
  white-space: nowrap;
  height: 45px;
`;
