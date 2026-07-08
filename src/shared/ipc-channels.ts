export const IPC_CHANNELS = {
  READ_ACE_LIST: 'acescout:read-ace-list',
  UPDATE_ACE: 'acescout:update-ace',
  EXEC_ACE: 'acescout:exec-ace',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
