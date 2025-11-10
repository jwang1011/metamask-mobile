import { createSelector } from 'reselect';
import { KnownCaipNamespace } from '@metamask/utils';
import { selectChainId } from '../../selectors/networkController';
import {
  selectAllNftContracts,
  selectAllNfts,
} from '../../selectors/nftController';
import { selectSelectedInternalAccountAddress } from '../../selectors/accountsController';
import { compareTokenIds } from '../../util/tokens';
import { createDeepEqualSelector } from '../../selectors/util';
import { selectEnabledNetworksByNamespace } from '../../selectors/networkEnablementController';
import { CollectibleAction, Collectible } from '../../actions/collectibles';

const favoritesSelector = (state: any) => state.collectibles.favorites;

export const isNftFetchingProgressSelector = (state: any): boolean =>
  state.collectibles.isNftFetchingProgress;

export const collectibleContractsSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  selectAllNftContracts,
  (address, chainId, allNftContracts) =>
    allNftContracts[address]?.[chainId] || [],
);

export const multichainCollectibleContractsSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectAllNftContracts,
  (address, allNftContracts) => allNftContracts[address] || {},
);

export const multichainCollectibleContractsByEnabledNetworksSelector =
  createDeepEqualSelector(
    selectSelectedInternalAccountAddress,
    selectAllNftContracts,
    selectEnabledNetworksByNamespace,
    (address, allNftContracts, enabledNetworks) => {
      const addressContracts = allNftContracts[address];

      if (!addressContracts || Object.keys(addressContracts).length === 0) {
        return {};
      }

      const enabledNetworksForEip155 =
        enabledNetworks?.[KnownCaipNamespace.Eip155] || {};

      if (
        !enabledNetworksForEip155 ||
        Object.keys(enabledNetworksForEip155).length === 0
      ) {
        return {};
      }

      const enabledChainIds = Object.keys(enabledNetworksForEip155).filter(
        (chainId) => enabledNetworksForEip155[chainId],
      );

      if (enabledChainIds.length === 0) {
        return {};
      }

      return enabledChainIds.reduce((acc, chainId) => {
        acc[chainId] = addressContracts[chainId] || [];
        return acc;
      }, {});
    },
  );

export const collectiblesSelector = createDeepEqualSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  selectAllNfts,
  (address, chainId, allNfts) => allNfts[address]?.[chainId] || [],
);

export const multichainCollectiblesSelector = createDeepEqualSelector(
  selectSelectedInternalAccountAddress,
  selectAllNfts,
  (address, allNfts) => allNfts[address] || {},
);

export const multichainCollectiblesByEnabledNetworksSelector =
  createDeepEqualSelector(
    selectSelectedInternalAccountAddress,
    selectAllNfts,
    selectEnabledNetworksByNamespace,
    (address, allNfts, enabledNetworks) => {
      const addressNfts = allNfts[address];

      if (!addressNfts || Object.keys(addressNfts).length === 0) {
        return {};
      }

      const enabledNetworksForEip155 =
        enabledNetworks?.[KnownCaipNamespace.Eip155] || {};

      if (
        !enabledNetworksForEip155 ||
        Object.keys(enabledNetworksForEip155).length === 0
      ) {
        return {};
      }

      const enabledChainIds = Object.keys(enabledNetworksForEip155).filter(
        (chainId) => enabledNetworksForEip155[chainId],
      );

      if (enabledChainIds.length === 0) {
        return {};
      }

      const enabledChainIdsSet = new Set(enabledChainIds);

      return Object.keys(addressNfts)
        .filter((chainId) => enabledChainIdsSet.has(chainId))
        .reduce((acc, chainId) => {
          acc[chainId] = addressNfts[chainId];
          return acc;
        }, {});
    },
  );

export const favoritesCollectiblesSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  favoritesSelector,
  (address, chainId, favorites) => favorites[address]?.[chainId] || [],
);

export const isCollectibleInFavoritesSelector = createSelector(
  favoritesCollectiblesSelector,
  (state, collectible) => collectible,
  (favoriteCollectibles, collectible) =>
    Boolean(
      favoriteCollectibles.find(
        ({ tokenId, address }) =>
          // TO DO: Remove after moving favorites to controllers.
          compareTokenIds(tokenId, collectible.tokenId) &&
          address === collectible.address,
      ),
    ),
);

interface FavoriteCollectible {
  tokenId: string;
  address: string;
}

const getFavoritesCollectibles = (
  favoriteCollectibles: any,
  selectedAddress: string,
  chainId: string,
): FavoriteCollectible[] => favoriteCollectibles[selectedAddress]?.[chainId] || [];

export const ADD_FAVORITE_COLLECTIBLE = 'ADD_FAVORITE_COLLECTIBLE';
export const REMOVE_FAVORITE_COLLECTIBLE = 'REMOVE_FAVORITE_COLLECTIBLE';
export const SHOW_NFT_FETCHING_LOADER = 'SHOW_NFT_FETCHING_LOADER';
export const HIDE_NFT_FETCHING_LOADER = 'HIDE_NFT_FETCHING_LOADER';

interface CollectiblesState {
  favorites: { [address: string]: { [chainId: string]: FavoriteCollectible[] } };
  isNftFetchingProgress: boolean;
}

interface ShowNftFetchingLoaderAction {
  type: typeof SHOW_NFT_FETCHING_LOADER;
}

interface HideNftFetchingLoaderAction {
  type: typeof HIDE_NFT_FETCHING_LOADER;
}

type CollectiblesReducerAction = CollectibleAction | ShowNftFetchingLoaderAction | HideNftFetchingLoaderAction;

const initialState: CollectiblesState = {
  favorites: {},
  isNftFetchingProgress: false,
};

const collectiblesFavoritesReducer = (state: CollectiblesState = initialState, action: CollectiblesReducerAction): CollectiblesState => {
  switch (action.type) {
    case ADD_FAVORITE_COLLECTIBLE: {
      const { selectedAddress, chainId, collectible } = action;
      const collectibles = getFavoritesCollectibles(
        state.favorites,
        selectedAddress,
        chainId,
      );
      collectibles.push({
        tokenId: collectible.tokenId,
        address: collectible.address,
      });
      const selectedAddressCollectibles =
        state.favorites[selectedAddress] || [];
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [selectedAddress]: {
            ...selectedAddressCollectibles,
            [chainId]: collectibles.slice(),
          },
        },
      };
    }
    case REMOVE_FAVORITE_COLLECTIBLE: {
      const { selectedAddress, chainId, collectible } = action;
      const collectibles = getFavoritesCollectibles(
        state.favorites,
        selectedAddress,
        chainId,
      );
      const indexToRemove = collectibles.findIndex(
        ({ tokenId, address }) =>
          // TO DO: Remove after moving favorites to controllers.
          compareTokenIds(tokenId, collectible.tokenId) &&
          address === collectible.address,
      );
      collectibles.splice(indexToRemove, 1);
      const selectedAddressCollectibles =
        state.favorites[selectedAddress] || [];
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [selectedAddress]: {
            ...selectedAddressCollectibles,
            [chainId]: collectibles.slice(),
          },
        },
      };
    }
    case SHOW_NFT_FETCHING_LOADER: {
      return {
        ...state,
        isNftFetchingProgress: true,
      };
    }
    case HIDE_NFT_FETCHING_LOADER: {
      return {
        ...state,
        isNftFetchingProgress: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const showNftFetchingLoadingIndicator = (): ShowNftFetchingLoaderAction => ({
  type: SHOW_NFT_FETCHING_LOADER,
});

export const hideNftFetchingLoadingIndicator = (): HideNftFetchingLoaderAction => ({
  type: HIDE_NFT_FETCHING_LOADER,
});

export default collectiblesFavoritesReducer;
