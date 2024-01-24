
import { useEffect, useState } from "react";
import { validateEmail, validateName, validatePassword } from "../hook/validation";


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
    const nameError = inputName === "name" ? validateName(value) : "";

    if ( passwordError) {
      setPasswordError( passwordError);
    } else {
      setPasswordError(null);
    }
    if (nameError) {
      setNameError(nameError);
    } else {
      setNameError(null);
    }
  };

  const handleSignupClick = () => {

    if (emailError && passwordError && nameError) {
      onSignup(email, password, name);
    }
  };

  useEffect(() => {
    // Asynchronously validate the email
    const validateEmailAsync = async () => {
      const error = await validateEmail(email);
      setEmailError(error);
    };

    validateEmailAsync();
  }, [email]);

  return (
    <div>
      <h2>회원가입</h2>
      <input
        placeholder="이름"
        value={name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => handleInputChange("password", e.target.value)}
      />
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <button onClick={handleSignupClick}>가입</button>

    </div>
  );
};

export default SignUpForm;