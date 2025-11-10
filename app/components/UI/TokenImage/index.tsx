import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import AssetIcon from '../AssetIcon';
import Identicon from '../Identicon';
import isUrl from 'is-url';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { selectTokenList } from '../../../selectors/tokenListController';
import { selectIsIpfsGatewayEnabled } from '../../../selectors/preferencesController';
import { isIPFSUri } from '../../../util/general';

interface TokenImageOwnProps {
  asset?: {
    address?: string;
    image?: string;
  };
  containerStyle?: ViewStyle;
  iconStyle?: ViewStyle;
}

const styles = StyleSheet.create({
  itemLogoWrapper: {
    width: 50,
    height: 50,
  },
  roundImage: {
    overflow: 'hidden',
    borderRadius: 25,
  },
});

const mapStateToProps = (state: any) => ({
  tokenList: selectTokenList(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type TokenImageProps = PropsFromRedux & TokenImageOwnProps;

const TokenImage: React.FC<TokenImageProps> = ({ asset, containerStyle, iconStyle, tokenList }) => {
  const isIpfsGatewayEnabled = useSelector(selectIsIpfsGatewayEnabled);

  const assetImage = isUrl(asset?.image) ? asset.image : null;
  const iconUrl =
    assetImage ||
    tokenList[asset?.address]?.iconUrl ||
    tokenList[asset?.address?.toLowerCase()]?.iconUrl ||
    '';

  const isIpfsDisabledAndUriIsIpfs =
    !isIpfsGatewayEnabled && isIPFSUri(iconUrl);

  return (
    <View style={[styles.itemLogoWrapper, containerStyle, styles.roundImage]}>
      {iconUrl || !isIpfsDisabledAndUriIsIpfs ? (
        <AssetIcon
          address={asset?.address}
          logo={iconUrl}
          customStyle={iconStyle}
        />
      ) : (
        <Identicon address={asset?.address} customStyle={iconStyle} />
      )}
    </View>
  );
};

export default connector(TokenImage);
