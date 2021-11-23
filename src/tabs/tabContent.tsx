interface Props {
  children: JSX.Element[];
  active: number;
}

const TabContent = (props: Props): JSX.Element => props.children[props.active];

export default TabContent;
