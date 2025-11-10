import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import Routes from '../../../constants/navigation/Routes';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import CollectibleMedia from '../CollectibleMedia';
import AssetActionButton from '../AssetOverview/AssetActionButton';
import Device from '../../../util/device';
import { toggleCollectibleContractModal } from '../../../actions/modals';
import collectiblesTransferInformation from '../../../util/collectibles-transfer';
import { newAssetTransaction } from '../../../actions/transaction';
import { areAddressesEqual } from '../../../util/address';
import { collectiblesSelector } from '../../../reducers/collectibles';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { TokenOverviewSelectorsIDs } from '../../../../e2e/selectors/wallet/TokenOverview.selectors';
import { WalletViewSelectorsIDs } from '../../../../e2e/selectors/wallet/WalletView.selectors';
import { InitSendLocation } from '../../Views/confirmations/constants/send';
import { handleSendPageNavigation } from '../../Views/confirmations/utils/send';

interface CollectibleContractOverviewOwnProps {
  collectibleContract: {
    name: string;
    address: string;
    logo?: string;
  };
  navigation: any;
  ownerOf: number;
}

const mapStateToProps = (state: any) => ({
  collectibles: collectiblesSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleCollectibleContractModal: () =>
    dispatch(toggleCollectibleContractModal()),
  newAssetTransaction: (selectedAsset: any) =>
    dispatch(newAssetTransaction(selectedAsset)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type CollectibleContractOverviewProps = PropsFromRedux & CollectibleContractOverviewOwnProps;

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.muted,
      alignContent: 'center',
      alignItems: 'center',
      paddingBottom: 30,
    },
    assetLogo: {
      marginTop: 20,
    },
    information: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 20,
    },
    name: {
      fontSize: 30,
      textAlign: 'center',
      color: colors.text.default,
      ...fontStyles.normal,
    },
    actions: {
      width: Device.isSmallDevice() ? '65%' : '50%',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
  });

/**
 * View that displays a specific collectible contract
 * including the overview (name, address, symbol, logo, description, total supply)
 */
class CollectibleContractOverview extends PureComponent<CollectibleContractOverviewProps> {
  static contextType = ThemeContext;
  declare context: React.ContextType<typeof ThemeContext>;

  onAdd = () => {
    const { navigation, collectibleContract } = this.props;
    navigation.push('AddAsset', {
      assetType: 'collectible',
      collectibleContract,
    });
  };

  onSend = () => {
    const { collectibleContract, collectibles } = this.props;
    const collectible = collectibles.find((collectible) =>
      areAddressesEqual(collectible.address, collectibleContract.address),
    );
    this.props.newAssetTransaction(collectible);
    handleSendPageNavigation(
      this.props.navigation.navigate,
      InitSendLocation.CollectibleContractOverview,
      collectible,
    );
  };

  onInfo = () => this.props.toggleCollectibleContractModal();

  renderLogo = () => {
    const {
      collectibleContract: { logo, address },
    } = this.props;
    return <CollectibleMedia small collectible={{ address, image: logo }} />;
  };

  render() {
    const {
      collectibleContract: { name, address },
      ownerOf,
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const lowerAddress = address.toLowerCase();
    const leftActionButtonText =
      lowerAddress in collectiblesTransferInformation
        ? collectiblesTransferInformation[lowerAddress].tradable &&
          strings('asset_overview.send_button')
        : strings('asset_overview.send_button');
    return (
      <View style={styles.wrapper} testID={'collectible-overview-screen'}>
        <View style={styles.assetLogo}>{this.renderLogo()}</View>
        <View style={styles.information}>
          <Text
            style={styles.name}
            testID={WalletViewSelectorsIDs.NFT_CONTAINER}
          >
            {ownerOf} {name}
          </Text>
        </View>

        <View style={styles.actions}>
          <AssetActionButton
            icon="send"
            onPress={this.onSend}
            label={leftActionButtonText}
            testID={TokenOverviewSelectorsIDs.SEND_BUTTON}
          />
          <AssetActionButton
            icon="add"
            onPress={this.onAdd}
            label={strings('asset_overview.add_collectible_button')}
            testID={TokenOverviewSelectorsIDs.ADD_BUTTON}
          />
          <AssetActionButton
            testID={'collectible-info-button'}
            icon="add"
            onPress={this.onInfo}
            label={strings('asset_overview.info')}
          />
        </View>
      </View>
    );
  }
}

export default connector(CollectibleContractOverview);
