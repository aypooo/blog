
import { useEffect, useState } from "react";
import { validateEmail, validateName, validatePassword } from "../hook/validation";
import Button from "./Button";


interface Props {
  onSignup: (email: string, password: string, name: string) => void;
}

const SignUpForm: React.FC<Props> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState<string | null>('');
  const [passwordError, setPasswordError] = useState<string | null>('');
  const [nameError, setNameError] = useState<string | null>('');

  const handleInputChange = (inputName: string, value: string) => {
    if (inputName === "name") {
      setName(value);
    } else if (inputName === "email") {
      setEmail(value);
    } else if (inputName === "password") {
      setPassword(value);
    }
    const passwordError = inputName === "password" ? validatePassword(value) : "";

    if ( passwordError) {
      setPasswordError( passwordError);
    } else {
      setPasswordError(null);
    }
  };

  const handleSignupClick = () => {
    if (emailError && passwordError && nameError) {
      onSignup(email, password, name);
    }
  };

  useEffect(() => {
    const validateEmailAsync = async () => {
      const error = await validateEmail(email);
      setEmailError(error);
    };
    const validateNameAsync = async () => {
      const error = await validateName(name);
      setNameError(error);
    };
    validateNameAsync()
    validateEmailAsync();
  }, [email, name]);

  return (
    <div className="sign-up-form">
      <h2 className="sign-up-form__title">회원가입</h2>
      <label>이름</label>
      <input
        placeholder="이름"
        value={name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="sign-up-form__input"
      />
      {nameError ? <p className="sign-up-form__error">{nameError}</p>:<p className="sign-up-form__error"></p> }
      <label>이메일</label>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        className="sign-up-form__input"
      />

      {emailError ? <p className="sign-up-form__error">{emailError}</p>:<p className="sign-up-form__error"></p> }
      <label>비밀번호</label>
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        className="sign-up-form__input"
      />
      {passwordError ? <p className="sign-up-form__error">{passwordError}</p>:<p className="sign-up-form__error"></p> }
      <Button label="등록하기" fullWidth={true} onClick={handleSignupClick}/>
    </div>
  );
};

export default SignUpForm;