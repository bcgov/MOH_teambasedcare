export enum RESPONSE_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const SUCCESS_RESPONSE = {
  status: RESPONSE_STATUS.SUCCESS,
};

export enum Permissions {
  PERFORM = 'X',
  ASSIST = 'A',
  CONTINUED_EDUCATION = 'C(E)',
}
