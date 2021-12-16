import React, { ComponentType } from 'react';
import { ReactNode } from 'react';
import { IconAngleRight } from 'hds-react';

interface Props {
  items: Array<{
    label: ReactNode;
    component?: ComponentType | keyof JSX.IntrinsicElements;
    [tagAttributes: string]: unknown;
  }>;
}

const Breadcrumbs = ({ items }: Props): JSX.Element => {
  return (
    <ol className="Breadcrumbs">
      {items.map(({ label, component = 'span', ...rest }, index) => {
        const Component = component;

        return (
          <li className="Breadcrumbs__item" key={index}>
            {index !== 0 && (
              <IconAngleRight
                size="s"
                className="Breadcrumbs__separator"
                aria-hidden={true}
              />
            )}
            <Component className="Breadcrumbs__label" {...rest}>
              {label}
            </Component>
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
