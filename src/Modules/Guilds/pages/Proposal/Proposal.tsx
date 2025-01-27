import { useProposal } from 'hooks/Guilds/ether-swr/guild/useProposal';
import AddressButton from 'Components/AddressButton/AddressButton';
import { ProposalDescription } from 'Components/ProposalDescription';
import { ProposalInfoCard } from 'Components/ProposalInfoCard';
import ProposalStatus from 'Components/ProposalStatus/ProposalStatus';
import { IconButton } from 'old-components/Guilds/common/Button';
import UnstyledLink from 'Components/Primitives/Links/UnstyledLink';
import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';
import { GuildAvailabilityContext } from 'contexts/Guilds/guildAvailability';
import { useGuildProposalIds } from 'hooks/Guilds/ether-swr/guild/useGuildProposalIds';
import useTotalLocked from 'hooks/Guilds/ether-swr/guild/useTotalLocked';
import useSnapshotId from 'hooks/Guilds/ether-swr/guild/useSnapshotId';
import useProposalCalls from 'hooks/Guilds/guild/useProposalCalls';
import { Loading } from 'Components/Primitives/Loading';
import Result, { ResultState } from 'old-components/Guilds/common/Result';
import React, { useContext } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import ProposalVoteCardWrapper from 'Modules/Guilds/Wrappers/ProposalVoteCardWrapper';
import ExecuteButton from 'Components/ExecuteButton';
import { useProposalState } from 'hooks/Guilds/useProposalState';
import useExecutable from 'hooks/Guilds/useExecutable';
import { useGuildConfig } from 'hooks/Guilds/ether-swr/guild/useGuildConfig';
import { ProposalState } from 'types/types.guilds.d';
import useProposalMetadata from 'hooks/Guilds/useProposalMetadata';
import useVotingPowerPercent from 'hooks/Guilds/guild/useVotingPowerPercent';
import { ActionsBuilder } from 'Components/ActionsBuilder';
import { useAccount } from 'wagmi';
import { isReadOnly } from 'provider/wallets';
import {
  HeaderTopRow,
  PageContainer,
  PageContent,
  PageHeader,
  PageTitle,
  ProposalActionsWrapper,
  SidebarContent,
  StyledIconButton,
} from './Proposal.styled';
import { useTranslation } from 'react-i18next';

const ProposalPage: React.FC = () => {
  const { t } = useTranslation();
  const { connector } = useAccount();
  const { chainName, guildId, proposalId } = useTypedParams();

  const { isLoading: isGuildAvailabilityLoading } = useContext(
    GuildAvailabilityContext
  );
  const { data: proposalIds } = useGuildProposalIds(guildId);
  const { data: proposal, error } = useProposal(guildId, proposalId);
  const { options } = useProposalCalls(guildId, proposalId);
  const { data: guildConfig } = useGuildConfig(guildId);

  const { data: metadata, error: metadataError } = useProposalMetadata(
    guildId,
    proposalId
  );

  const { data: snapshotId } = useSnapshotId({
    contractAddress: guildId,
    proposalId,
  });

  const { data: totalLocked } = useTotalLocked(guildId, snapshotId?.toString());

  const quorum = useVotingPowerPercent(
    guildConfig?.votingPowerForProposalExecution,
    totalLocked
  );

  const status = useProposalState(proposal);

  const {
    data: { executeProposal },
  } = useExecutable();

  if (!isGuildAvailabilityLoading) {
    if (!proposalIds?.includes(proposalId)) {
      return (
        <Result
          state={ResultState.ERROR}
          title="We couldn't find that proposal."
          subtitle="It probably doesn't exist."
          extra={
            <UnstyledLink to={`/${chainName}/${guildId}`}>
              <IconButton iconLeft>
                <FiArrowLeft /> See all proposals
              </IconButton>
            </UnstyledLink>
          }
        />
      );
    } else if (error) {
      return (
        <Result
          state={ResultState.ERROR}
          title={t('genericProposalError')}
          subtitle={error.message}
        />
      );
    }
  }

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <HeaderTopRow>
            <UnstyledLink to={`/${chainName}/${guildId}`}>
              <StyledIconButton variant="secondary" iconLeft>
                <FaChevronLeft style={{ marginRight: '15px' }} />{' '}
                {guildConfig?.name}
              </StyledIconButton>
            </UnstyledLink>

            <ProposalStatus
              timeDetail={proposal?.timeDetail}
              status={status}
              endTime={proposal?.endTime}
            />
            {status === ProposalState.Executable && !isReadOnly(connector) && (
              <ExecuteButton executeProposal={executeProposal} />
            )}
          </HeaderTopRow>
          <PageTitle>
            {proposal?.title || (
              <Loading loading text skeletonProps={{ width: '800px' }} />
            )}
          </PageTitle>
        </PageHeader>

        <AddressButton address={proposal?.creator} />

        <ProposalDescription metadata={metadata} error={metadataError} />

        <ProposalActionsWrapper>
          <ActionsBuilder options={options} editable={false} />
        </ProposalActionsWrapper>
      </PageContent>
      <SidebarContent>
        <ProposalVoteCardWrapper />
        <ProposalInfoCard
          proposal={proposal}
          guildConfig={guildConfig}
          quorum={quorum}
        />
      </SidebarContent>
    </PageContainer>
  );
};

export default ProposalPage;
