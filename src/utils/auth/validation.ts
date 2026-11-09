// 이메일 형식 검사
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
// 전체 검사용이라 g 플래그를 붙이지 않는다. (붙이면 test()가 호출마다 lastIndex가 바뀐다)
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 12;

export function isNicknameValid(nickname: string) {
  const length = nickname.trim().length;
  return length >= NICKNAME_MIN_LENGTH && length <= NICKNAME_MAX_LENGTH;
}
