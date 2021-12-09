import { cloneElement } from 'react';
import classNames from 'classnames';

interface Props {
  children: JSX.Element;
  className?: string;
}

const TabPane = (props: Props): JSX.Element =>
  cloneElement(props.children, {
    className: classNames('TabPane', props.className),
  });

export default TabPane;
