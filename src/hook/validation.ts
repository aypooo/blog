import { readAllUserData } from "../firebase/auth";
import { User } from "../recoil";

export const validateEmail = async (email: string): Promise<string | null> => {
  const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  try {
    const userData = await readAllUserData();

    if (userData) {
      // userData가 User[] 형식임을 확인하고 캐스팅합니다.
      const userDataArray = userData as unknown as User[];

      // 데이터베이스에서 이메일이 이미 존재하는지 확인
      const emailExists = Object.values(userDataArray).some((user) => user.email === email);

      if (emailExists) {
        return '이미 존재하는 이메일 주소입니다.';
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
    return '이메일 유효성을 확인하는 도중 오류가 발생했습니다.';
  }

  // 이메일이 데이터베이스에 존재하지 않고 유효하면
  return emailRegex.test(email) ? null : '유효하지 않은 이메일 주소입니다.';
};

export const validateName = async (name: string): Promise<string | null> => {
  const namexists = name.trim() !== '' ? null : '이름을 입력해주세요.';
  try {
    const userData = await readAllUserData();

    if (userData) {
      const userDataArray = userData as unknown as User[];
      const namexists = Object.values(userDataArray).some((user) => user.name === name);

      if (namexists) {
        return '이미 존재하는 이름입니다.';
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
    return '이름 유효성을 확인하는 도중 오류가 발생했습니다.';
  }
  
  return namexists;
}



export const validatePassword = (password: string): string | null => {
  const regex = /^(?=.*[A-Za-z\d])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

  if (password.length < 6) {
    return '비밀번호는 6자 이상이어야 합니다.';
  }

  if (password.length >= 12) {
    return '비밀번호는 12자 미만이어야 합니다.';
  }

  if (!regex.test(password)) {
    return '비밀번호는 특수문자를 포함해야 합니다.';
  }

  return null;
};
  
// export const validateName = (name: string): string | null => {
//   return name.trim() !== '' ? null : '이름을 입력해주세요.';
// };

