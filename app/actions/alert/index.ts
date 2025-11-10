interface ShowAlertParams {
  isVisible: boolean;
  autodismiss: number | null;
  content: React.ReactNode | null;
  data: any;
}

interface DismissAlertAction {
  type: 'HIDE_ALERT';
}

interface ShowAlertAction {
  type: 'SHOW_ALERT';
  isVisible: boolean;
  autodismiss: number | null;
  content: React.ReactNode | null;
  data: any;
}

export type AlertAction = DismissAlertAction | ShowAlertAction;

export function dismissAlert(): DismissAlertAction {
  return {
    type: 'HIDE_ALERT',
  };
}

export function showAlert({ isVisible, autodismiss, content, data }: ShowAlertParams): ShowAlertAction {
  return {
    type: 'SHOW_ALERT',
    isVisible,
    autodismiss,
    content,
    data,
  };
}
