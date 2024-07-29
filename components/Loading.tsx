import React from 'react'
import ReactLoading from 'react-loading';

type LoadingProps = {
    type?: string;
    color?: string;
}

const Loading = ({type = 'balls', color='#24ae7c'}: LoadingProps) => {
  return (
    <ReactLoading type={type} color={color} height={100} width={60} />
  )
}

export default Loading