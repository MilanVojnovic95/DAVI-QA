import { useWeb3React } from '@web3-react/core';
import { getNetworkById } from 'utils';

const configs = {
  arbitrum: require('configs/arbitrum/config.json'),
  arbitrumTestnet: require('configs/arbitrumTestnet/config.json'),
  mainnet: require('configs/mainnet/config.json'),
  xdai: require('configs/xdai/config.json'),
  goerli: require('configs/goerli/config.json'),
  localhost: require('configs/localhost/config.json'),
};

const useNetworkConfig = (chain?: number): NetworkConfig => {
  const { chainId } = useWeb3React();

  return configs[getNetworkById(chain || chainId)?.name ?? 'mainnet'];
};

export default useNetworkConfig;