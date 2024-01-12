import { useEffect, useRef } from "react";

const InfiniteScroll = ({ children, callback, loading }: { children: React.ReactNode; callback: () => Promise<void>; loading: boolean }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection: IntersectionObserverCallback = async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !loading) {
        await callback();
      }
    }
  };

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
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
  }, [callback, loading]);

  return <div ref={targetRef}>{children}</div>;
};

export default InfiniteScroll;