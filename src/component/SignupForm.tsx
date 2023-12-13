import { useState } from "react";

interface Props {
  onSignup: (email: string, password: string, name:string) => void;
}
const SignUpForm: React.FC<Props> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignupClick = () => {
    onSignup(email, password, name);
  };

  return (
    <div>
      <h2>SignUp</h2>
      <input placeholder="name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignupClick}>Signup</button>
    </div>
  );
};

export default SignUpForm;