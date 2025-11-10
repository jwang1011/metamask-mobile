import React from 'react';
import { ChainId } from '@metamask/controller-utils';
import { connect, ConnectedProps } from 'react-redux';
import { ViewStyle } from 'react-native';
import TokenIcon from '../Swaps/components/TokenIcon';
import {
  selectChainId,
  selectEvmTicker,
} from '../../../selectors/networkController';

interface NetworkMainAssetLogoOwnProps {
  chainId?: string;
  ticker?: string;
  style?: ViewStyle;
  big?: boolean;
  biggest?: boolean;
  testID?: string;
}

const mapStateToProps = (state: any, ownProps: NetworkMainAssetLogoOwnProps) => ({
  chainId: ownProps.chainId || selectChainId(state),
  ticker: ownProps.ticker || selectEvmTicker(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type NetworkMainAssetLogoProps = PropsFromRedux & NetworkMainAssetLogoOwnProps;

const NetworkMainAssetLogo: React.FC<NetworkMainAssetLogoProps> = ({
  chainId,
  ticker,
  style,
  big,
  biggest,
  testID,
}) => {
  if (chainId === ChainId.mainnet) {
    return (
      <TokenIcon
        big={big}
        biggest={biggest}
        symbol={'ETH'}
        style={style}
        testID={testID}
      />
    );
  }
  return (
    <TokenIcon
      big={big}
      biggest={biggest}
      symbol={ticker}
      style={style}
      testID={testID}
    />
  );
};

export default connector(NetworkMainAssetLogo);
