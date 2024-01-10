import { useEffect, useRef, useState } from "react";

const InfiniteScroll = ({ children, loadMore }: { children: React.ReactNode; loadMore: () => Promise<void> }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    console.log(targetRef)
    console.log(loading)
    console.log('뷰포트에서 다시 패치안됨. 수정해야함')
    const handleIntersection: IntersectionObserverCallback = async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !loading) {
            console.log('1')
            setLoading(true);
            await loadMore();
        }
      }
    };
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      };
  
    useEffect(() => {
 
      const observer = new IntersectionObserver(handleIntersection, options);
  
      const target = targetRef.current;
      if (target) {
        observer.observe(target);
      }
  
      return () => {
        if (target) {
          observer.unobserve(target);
        }
      };
    }, [loadMore, loading]);
  
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }, [loading]);
  
    return <div ref={targetRef}>{children}</div>;
  };
export default InfiniteScroll;