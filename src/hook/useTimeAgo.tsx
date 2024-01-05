import { useEffect, useState } from 'react';

const useTimeAgo = (timestamp: Date) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const createdDate = new Date(timestamp);
    
      if (isNaN(createdDate.getTime())) {
        // 날짜가 유효하지 않은 경우
        setTimeAgo('방금전');
        return;
      }
    
      const timeDifference = now.getTime() - createdDate.getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
    
      if (seconds < 60) {
        setTimeAgo('방금 전');
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}분 전`);
      } else if (hours < 24) {
        setTimeAgo(`${hours}시간 전`);
      } else {
        // 여기에 더 많은 경우를 추가할 수 있습니다.
        setTimeAgo(createdDate.toLocaleString()); // 일정 시간 이상이 지났으면 날짜를 그대로 표시
      }
    };

    calculateTimeAgo();

    // 1분마다 업데이트
    const intervalId = setInterval(calculateTimeAgo, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timeAgo;
};

export default useTimeAgo;