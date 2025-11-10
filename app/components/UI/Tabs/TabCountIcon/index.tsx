import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Platform, StyleProp, ViewStyle } from 'react-native';
import { fontStyles } from '../../../../styles/common';
import { connect, ConnectedProps } from 'react-redux';
import { ThemeContext, mockTheme } from '../../../../util/theme';
import { BrowserViewSelectorsIDs } from '../../../../../e2e/selectors/Browser/BrowserView.selectors';

interface TabCountIconOwnProps {
  style?: StyleProp<ViewStyle>;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    tabIcon: {
      borderWidth: 2,
      borderColor: colors.text.alternative,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabCount: {
      color: colors.text.alternative,
      flex: 0,
      fontSize: 15,
      textAlign: 'center',
      alignSelf: 'center',
      ...fontStyles.normal,
    },
  });

const mapStateToProps = (state: any) => ({
  tabCount: state.browser.tabs.length,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type TabCountIconProps = PropsFromRedux & TabCountIconOwnProps;

/**
 * PureComponent that renders an icon showing
 * the current number of open tabs
 */
class TabCountIcon extends PureComponent<TabCountIconProps> {
  static contextType = ThemeContext;
  declare context: React.ContextType<typeof ThemeContext>;

  render() {
    const { tabCount, style } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={[styles.tabIcon, style]}>
        <Text
          style={styles.tabCount}
          testID={BrowserViewSelectorsIDs.TABS_NUMBER}
        >
          {tabCount}
        </Text>
      </View>
    );
  }
}

export default connector(TabCountIcon);
