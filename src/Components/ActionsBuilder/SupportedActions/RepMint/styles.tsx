import styled from 'styled-components';
import NumericalInput from 'old-components/Guilds/common/Form/NumericalInput';
import StyledIcon from 'old-components/Guilds/common/SVG';
import { Box } from 'Components/Primitives/Layout';
import { StyledToolTip } from 'old-components/Guilds/common/ToolTip';
import { ErrorLabel } from 'Components/Primitives/Forms/ErrorLabel';

export const StyledMintIcon = styled(StyledIcon)`
  margin: 0;
`;

export const Control = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0;
  width: 100%;
`;

export const ControlLabel = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.proposalText.grey};
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

export const ControlRow = styled(Box)`
  display: flex;
  align-items: stretch;
  height: 100%;
`;

export const RepMintInput = styled(NumericalInput)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StyledInfoIcon = styled(StyledIcon)`
  &:hover + ${StyledToolTip} {
    visibility: visible;
  }
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Error = styled(ErrorLabel)`
  margin-top: 0.5rem;
`;
