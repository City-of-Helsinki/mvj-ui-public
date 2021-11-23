// @flow
import React from 'react';
import classNames from 'classnames';

interface tabProps {
  label: string;
}

interface Props {
  active: number;
  className?: string;
  onTabClick: (i: number) => void;
  tabs: Array<tabProps>;
}

const Tabs = (props: Props): JSX.Element => {
  const { active, className, onTabClick, tabs } = props;

  return (
    <div className={classNames('tabs', className)}>
      <div className="tabs__wrapper">
        <ul>
          {tabs.map((tab, i) => {
            const handleTabClick = () => {
              onTabClick(i);
            };

            const handleKeyDown = (
              e: React.KeyboardEvent<HTMLAnchorElement>
            ) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                handleTabClick();
              }
            };

            return (
              <li
                className={classNames({ 'is-active': Number(active) === i })}
                key={i}
              >
                <a
                  aria-selected={Number(active) === i}
                  aria-label={tab.label}
                  onClick={handleTabClick}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                >
                  <span className="tabs__label">{tab.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Tabs;
