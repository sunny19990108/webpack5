import React, { useEffect, useState,useCallback } from 'react';
import './hello.less';

interface ListItem {
  name: String;
  age: Number;
}

const Hello = () => {

  const [list,setList] = useState<ListItem[]>([]);

  const getList = useCallback(() => {
    console.log('getList');
    setList([
      {
        name: 'li',
        age: 23,
      }
    ])
  },[]);

  useEffect(() => {
    getList();
  },[getList])
  
  return (
    <div>
      {list?.length > 0 && (
        <div className='container'>
          <span className='list'>list 存在 </span>
        </div>
      )}
    </div>
  );
}

export default Hello;