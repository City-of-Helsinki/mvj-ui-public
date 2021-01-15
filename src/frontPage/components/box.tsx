import React from 'react';
import classNames from 'classnames';

interface Props {
  topLabel: string,
  count: number,
  label: string,
  bottomText: string,
  color: string,
}

const Box = ({
  topLabel, 
  count,
  label,
  bottomText,
  color,
}: Props): JSX.Element => {
  return (
    <div className={classNames('box', color)}>
      <div className={'top-label'}>
        {`${topLabel}: ${count}`}
      </div>
      <div className='image'/>
      <div className={'box-label'}>
        {label}
      </div>
      <div className={'bottom-text'}>
        {bottomText}
      </div>
    </div>
  );
};	

export default Box;