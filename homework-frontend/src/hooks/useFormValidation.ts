import { useEffect, useState } from 'react';
import {
  validateUsername,
  validatePassword,
  type FormValidationError,
} from '../utils/validation';

type TouchedFields = {
  username: boolean;
  password: boolean;
};

export const useFormValidation = (
  username: string,
  password: string,
  isRegistering: boolean
) => {
  const [validationErrors, setValidationErrors] = useState<FormValidationError>(
    {}
  );
  const [isTouched, setIsTouched] = useState<TouchedFields>({
    username: false,
    password: false,
  });

  useEffect(() => {
    const errors: FormValidationError = {};

    if (isRegistering && (isTouched.username || username)) {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        errors.username = usernameValidation.error;
      }
    }

    if (isRegistering && (isTouched.password || password)) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
      }
    }

    setValidationErrors(errors);
  }, [
    username,
    password,
    isTouched.username,
    isTouched.password,
    isRegistering,
  ]);

  const setFieldTouched = (
    field: keyof TouchedFields,
    value: boolean = true
  ) => {
    setIsTouched(prev => ({ ...prev, [field]: value }));
  };

  const setAllFieldsTouched = () => {
    setIsTouched({ username: true, password: true });
  };

  const resetValidation = () => {
    setValidationErrors({});
    setIsTouched({ username: false, password: false });
  };

  const formIsValid = (() => {
    if (!isRegistering) {
      return username.trim().length > 0 && password.trim().length > 0;
    }

    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);

    const isValid =
      usernameValidation.isValid &&
      passwordValidation.isValid &&
      username.trim().length > 0 &&
      password.trim().length > 0;

    return isValid;
  })();

  return {
    validationErrors,
    isTouched,
    setFieldTouched,
    setAllFieldsTouched,
    resetValidation,
    formIsValid,
  };
};
