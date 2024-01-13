export type CreactProps = {
  [key: string]: any;
  children: CreactNode[];
};

export type CreactNode = {
  type: string;
  props: CreactProps;
};

export const TEXT_ELEMENT = "TEXT_ELEMENT";

export function createTextNode(text: string): CreactNode {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(
  type: string,
  props: Record<string, any>,
  ...children: (CreactNode | string)[]
): CreactNode {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

export function render(el: CreactNode, container: HTMLElement) {
  const dom =
    el.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if (key === "children") return;
    dom[key] = el.props[key];
  });

  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom as HTMLElement);
  });

  container.append(dom);
}

const Creact = {
  render,
  createElement,
};

export default Creact;
