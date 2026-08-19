export const AUTH = {
  pid: '0511034199',
  password: 'k?ymw7vJ',
  readerCode: '051103',
}

export function pidMatches(value) {
  return String(value || '').replace(/\s/g, '') === AUTH.pid
}

export function passwordMatches(value) {
  return value === AUTH.password
}

export function readerMatches(value) {
  return String(value || '').replace(/\s/g, '') === AUTH.readerCode
}
