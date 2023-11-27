import {
  ComponentType,
  ElementType,
  PropsWithChildren,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface Props {
  topLabel?: string;
  label: string;
  bottomText: ReactNode;
  color?: 'pink' | 'gray' | 'yellow' | 'blue';
  image?: ReactNode;
  actions?: ReactNode;
  url?: string;
  headerComponent?:
    | ComponentType<PropsWithChildren<{ className: string }>>
    | ElementType;
}

const BoxGridBox = ({
  topLabel,
  label,
  bottomText,
  color = 'gray',
  image,
  actions,
  url,
  headerComponent: HComponent = 'div',
}: Props): JSX.Element => {
  const children = (
    <>
      {topLabel && <div className="BoxGridBox__top-label">{topLabel}</div>}
      {image && <div className="BoxGridBox__image">{image}</div>}
      <HComponent className="BoxGridBox__label">{label}</HComponent>
      <div className="BoxGridBox__bottom-text">{bottomText}</div>
      {actions && <div className="BoxGridBox__actions">{actions}</div>}
    </>
  );

  const rootProps = {
    className: classNames(
      'BoxGridBox',
      `BoxGridBox--${color}`,
      !!url && 'BoxGridBox--link',
    ),
  };

  if (url) {
    return (
      <Link {...rootProps} to={url} reloadDocument={false} aria-label={label}>
        {children}
      </Link>
    );
  }

  return <div {...rootProps}>{children}</div>;
};

export default BoxGridBox;
