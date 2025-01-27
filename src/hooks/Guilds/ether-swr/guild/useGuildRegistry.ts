import useEtherSWR from '../useEtherSWR';
import GuildRegistry from 'contracts/GuildsRegistry.json';
import useNetworkConfig from 'hooks/Guilds/useNetworkConfig';

export const useGuildRegistry = (contractAddress?: string) => {
  const config = useNetworkConfig();

  const address = contractAddress || config?.contracts?.utils.guildRegistry;
  const { data, error, isValidating } = useEtherSWR(
    address ? [address, 'getGuildsAddresses'] : [],
    {
      ABIs: new Map([[address, GuildRegistry.abi]]),
      refreshInterval: 0,
    }
  );

  return {
    data,
    isValidating,
    error,
  };
};
