import { BigNumber } from 'ethers';
import { Moment } from 'moment';

export enum ProposalState {
  Active = 'Active',
  Passed = 'Passed',
  Executed = 'Executed',
  Failed = 'Failed',
}

export interface Proposal {
  id: string;
  creator: string;
  startTime: Moment;
  endTime: Moment;
  to: string[];
  data: string[];
  value: BigNumber[];
  totalActions: BigNumber;
  title: string;
  contentHash: string;
  state: ProposalState;
  totalVotes: BigNumber[];
}

// TODO: Move this to the ENSAvatar types file once that's refactored
export interface ENSAvatar {
  imageUrl?: string;
  ensName?: string;
}
