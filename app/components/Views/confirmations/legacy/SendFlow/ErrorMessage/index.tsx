import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { strings } from '../../../../../../../locales/i18n';
import Alert, { AlertType } from '../../../../../Base/Alert';
import Text from '../../../../../Base/Text';
import { CommonSelectorsIDs } from '../../../../../../../e2e/selectors/Common.selectors';

interface ErrorMessageProps {
  errorMessage?: string | React.ReactElement | React.ReactElement[];
  errorContinue?: boolean;
  onContinue?: () => void;
  isOnlyWarning?: boolean;
}

const styles = StyleSheet.create({
  button: {
    marginTop: 27,
    marginBottom: 12,
  },
  errorMessage: {
    flex: 0,
  },
});

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  const { errorMessage, errorContinue, onContinue, isOnlyWarning } = props;
  return (
    <Alert type={isOnlyWarning ? AlertType.Info : AlertType.Error}>
      {(textStyle) => (
        <View>
          <Text
            small
            style={[textStyle, styles.errorMessage]}
            testID={CommonSelectorsIDs.ERROR_MESSAGE}
          >
            {errorMessage}
          </Text>
          {errorContinue && (
            <TouchableOpacity onPress={onContinue} style={styles.button}>
              <Text small link centered>
                {strings('transaction.continueError')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Alert>
  );
};

export default ErrorMessage;
