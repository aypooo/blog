import { useState } from "react";

interface Props {
  onSignup: (email: string, password: string) => void;
}
const SignUpForm: React.FC<Props> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupClick = () => {
    onSignup(email, password);
  };

  return (
    <div>
      <h2>SignUp</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignupClick}>Signup</button>
    </div>
  );
};

export default SignUpForm;