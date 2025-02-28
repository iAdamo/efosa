const validatePassword = (password) => {
  const validations = {
    atLeastOneLetter: /[A-Za-z]/.test(password),
    numberOrSpecialChar: /[0-9]|[^A-Za-z0-9]/.test(password),
  };
  return validations;
};

export default validatePassword;
