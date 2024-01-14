export type CreactProps = {
  [key: string]: any;
  children: CreactNode[];
};

export type CreactNode = {
  type: string;
  props: CreactProps;
};

export enum NodeTypes {
  Text = "TEXT_ELEMENT",
}

type FiberNode = {
  type: string;
  props: CreactProps;
  parent?: FiberNode;
  child?: FiberNode;
  sibling?: FiberNode;
  uncle?: FiberNode;
  dom?: HTMLElement | Text;
};

let nextUnitOfWork: FiberNode | undefined = undefined;

function createTextNode(text: string): CreactNode {
  return {
    type: NodeTypes.Text,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(
  type: string,
  props: Record<string, any> | null,
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

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function createDom(type: string) {
  return type === NodeTypes.Text ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom: HTMLElement | Text, props: CreactProps) {
  Object.keys(props).forEach((key) => {
    if (key === "children") return;
    // @ts-ignore
    dom[key] = props[key];
  });
}

function performUnitOfWork(fiber: FiberNode): FiberNode | undefined {
  const dom = (fiber.dom = fiber.dom || createDom(fiber.type));

  updateProps(dom, fiber.props);

  if (fiber.parent) {
    (fiber.parent?.dom as HTMLElement).append(dom);
  }

  let prevUnitOfWork: FiberNode | undefined = undefined;
  fiber.props.children.forEach((child, idx) => {
    const unitOfWork: FiberNode = {
      type: child.type,
      props: child.props,
      parent: fiber,
    };

    if (idx === 0) {
      fiber.child = unitOfWork;
    } else {
      prevUnitOfWork!.sibling = unitOfWork;
    }

    if (idx === fiber.props.children.length - 1) {
      unitOfWork.uncle = fiber.sibling || fiber.uncle;
    }

    prevUnitOfWork = unitOfWork;
  });

  return fiber.child || fiber.sibling || fiber.uncle;
}

export function render(el: CreactNode, container: HTMLElement) {
  nextUnitOfWork = {
    type: "",
    props: {
      children: [el],
    },
    dom: container,
  };

  requestIdleCallback(workLoop);
}

const Creact = {
  render,
  createElement,
};

export default Creact;
