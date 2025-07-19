
// src/navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    Dashboard: { notificationPayload?: any } | undefined;
    Inventory: { notificationPayload?: any } | undefined;
    RequestForm: { notificationPayload?: any } | undefined;
    RequestDetail: { notificationPayload?: any } | undefined;
    ComplaintsList: { notificationPayload?: any } | undefined;
    ComplaintForm: { notificationPayload?: any } | undefined;
    ComplaintDetail: { notificationPayload?: any } | undefined;
    Profile: undefined;
  };
  