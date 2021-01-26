import {cloneElement} from 'react';

interface Props {
  children: JSX.Element,
  className?: string,
}

const TabPane = (props: Props): JSX.Element => cloneElement(props.children, {className: props.className});

export default TabPane;
