import React from 'react';
import useTimeAgo from '../hook/useTimeAgo'

const TimeAgoComponent = ({ timestamp }: {timestamp:Date}) => {
  const timeAgo = useTimeAgo(timestamp);
  return <span className='time-ago'>{timeAgo}</span>;
};

export default TimeAgoComponent;