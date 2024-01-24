import { useEffect } from 'react';
import { Post } from '../recoil';

const useSortData = (initialData: Post[], setData: (data: Post[]) => void) => {
  const handleSortByLatest = () => {
    const sortedData = [...initialData].sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
    setData(sortedData);
  };

  const handleSortByLikes = () => {
    const sortedData = [...initialData].sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0));
    setData(sortedData);
  };

  const handleSortByComments = () => {
    const sortedData = [...initialData].sort((a, b) => (a.comments ? (Object.keys(a.comments).length || 0): 0)- (b.comments ? (Object.keys(b.comments).length || 0): 0))
    setData(sortedData);
  };

  useEffect(() => {
    if (initialData.length === 0) {
      // 데이터를 초기화하는 로직
    }
  }, [initialData, setData]);

  return { handleSortByLatest, handleSortByLikes, handleSortByComments };
};

export default useSortData;