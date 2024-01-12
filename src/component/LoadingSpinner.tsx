import React from 'react';
import { FadeLoader } from 'react-spinners';

const LoadingSpinner = ({ loading, color='#666' }:{loading:boolean,color:string}) => {
      return (
        <div style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <FadeLoader color={color} loading={loading} />
        </div>
      );
    };
    
    export default LoadingSpinner;