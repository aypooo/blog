import React from 'react';
import DOMPurify from 'dompurify';

const SanitizedHTML = ({ html }: {html:string}) => {
  const sanitizedHTML = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
};

export default SanitizedHTML;