import React from 'react';
import {  SyncLoader } from 'react-spinners';

const LoadingSpinner = ({ loading, color='#666', size='15px' }:{loading:boolean,color?:string,size?:string}) => {
      return (
        <div style={{ backgroundColor:'#ffffff', display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center',}}>
          <SyncLoader size={size} margin='5px' color={color} loading={loading} />
        </div>
      );
    };
    
    export default LoadingSpinner;