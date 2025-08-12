export type ValidationType = {
  isValid: boolean;
  error?: string;
};

export type FormValidationError = {
  username?: string;
  password?: string;
};

export const validateUsername = (username: string): ValidationType => {
  if (!username.trim()) {
    return {
      isValid: false,
      error: 'Имя пользователя обязательно',
    };
  }

  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error:
        'Только английские буквы, цифры, точки, дефисы и нижние подчеркивания',
    };
  }

  if (
    username.startsWith('.') ||
    username.startsWith('-') ||
    username.endsWith('.') ||
    username.endsWith('-')
  ) {
    return {
      isValid: false,
      error:
        'Имя пользователя не должно начинаться или заканчиваться точкой или дефисом',
    };
  }
  if (username.trim().length < 3) {
    return {
      isValid: false,
      error: 'Слишком короткое имя пользователя',
    };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationType => {
  if (!password) {
    return {
      isValid: false,
      error: 'Пароль обязателен',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Минимум 8 символов',
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Пароль должен содержать цифры',
    };
  }

  if (!/[a-zA-Zа-яА-Я]/.test(password)) {
    return {
      isValid: false,
      error: 'Пароль должен содержать буквы',
    };
  }

  return { isValid: true };
};

export const validateForm = (
  username: string,
  password: string,
  isRegistering: boolean
): FormValidationError => {
  const errors: FormValidationError = {};

  if (isRegistering) {
    const usernameValidation = validateUsername(username);

    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }
  }

  return errors;
};

export const isFormValid = (
  username: string,
  password: string,
  isRegistering: boolean
) => {
  const usernameValidation = validateUsername(username);
  const passwordValidation = isRegistering
    ? validatePassword(password)
    : { isValid: true };

  return (
    usernameValidation.isValid &&
    passwordValidation.isValid &&
    username.trim().length > 0 &&
    password.trim().length > 0
  );
};
