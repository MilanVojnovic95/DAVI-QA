import Avatar from 'old-components/Guilds/Avatar';
import useENSAvatar from 'hooks/Guilds/ether-swr/ens/useENSAvatar';
import { FiArrowRight } from 'react-icons/fi';
import { MAINNET_ID, shortenAddress } from 'utils';
import { ActionViewProps } from '..';
import { Segment } from '../common/infoLine';
import { ReactComponent as Mint } from 'assets/images/mint.svg';
import useBigNumberToNumber from 'hooks/Guilds/conversions/useBigNumberToNumber';
import { useTotalSupply } from 'hooks/Guilds/guild/useTotalSupply';
import { useTokenData } from 'hooks/Guilds/guild/useTokenData';
import { useTranslation } from 'react-i18next';
import { StyledMintIcon } from './styles';

const RepMintInfoLine: React.FC<ActionViewProps> = ({ decodedCall }) => {
  const { t } = useTranslation();

  const { parsedData } = useTotalSupply({ decodedCall });
  const { tokenData } = useTokenData();

  const totalSupply = useBigNumberToNumber(tokenData?.totalSupply, 18);

  const { ensName, imageUrl } = useENSAvatar(parsedData?.toAddress, MAINNET_ID);

  const roundedRepAmount = useBigNumberToNumber(parsedData?.amount, 16, 3);
  const roundedRepPercent = roundedRepAmount / totalSupply;

  return (
    <>
      <Segment>
        <StyledMintIcon src={Mint} />
      </Segment>
      <Segment>
        {t('mint')} {roundedRepPercent} %
      </Segment>
      <Segment>
        <FiArrowRight />
      </Segment>
      <Segment>
        <Avatar defaultSeed={parsedData?.toAddress} src={imageUrl} size={24} />
      </Segment>
      <Segment>{ensName || shortenAddress(parsedData?.toAddress)}</Segment>
    </>
  );
};

export default RepMintInfoLine;
