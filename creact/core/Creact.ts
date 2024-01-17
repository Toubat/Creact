export type CreactProps = {
  [key: string]: any;
  children: CreactNode[];
};

export type CreactNode = {
  type: ElementType;
  props: CreactProps;
};

export enum NodeTypes {
  Text = "TEXT_ELEMENT",
}

export type FC<T extends Object = any> = (props: T) => CreactNode;

export type ElementType = FC | string;

type FiberNode = {
  type: ElementType;
  props: CreactProps;
  parent?: FiberNode;
  child?: FiberNode;
  sibling?: FiberNode;
  uncle?: FiberNode;
  dom?: HTMLElement | Text;
};

let root: FiberNode | undefined = undefined;
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
  type: ElementType,
  props: Record<string, any> | null,
  ...children: (CreactNode | string)[]
): CreactNode {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode = typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root!.child!);
  root = undefined;
}

function commitWork(fiber: FiberNode | undefined) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (fiberParent && !fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    (fiberParent!.dom as HTMLElement).append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type: string) {
  return type === NodeTypes.Text ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom: HTMLElement | Text, props: CreactProps) {
  Object.keys(props).forEach((key) => {
    if (key === "children") return;

    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      dom.addEventListener(eventType, props[key]);
    } else {
      // @ts-ignore
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber: FiberNode, children: FiberNode[]) {
  let prevUnitOfWork: FiberNode | undefined = undefined;
  children.forEach((child, idx) => {
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

    if (idx === children.length - 1) {
      unitOfWork.uncle = fiber.sibling || fiber.uncle;
    }

    prevUnitOfWork = unitOfWork;
  });
}

function updateFunctionComponent(fiber: FiberNode) {
  const children = [(fiber.type as FC)(fiber.props)];
  initChildren(fiber, children);
}

function updateHostComponent(fiber: FiberNode) {
  const dom = (fiber.dom = fiber.dom || createDom(fiber.type as string));
  updateProps(dom, fiber.props);
  initChildren(fiber, fiber.props.children);
}

function performUnitOfWork(fiber: FiberNode): FiberNode | undefined {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

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

  root = nextUnitOfWork;
}

requestIdleCallback(workLoop);

const Creact = {
  render,
  createElement,
};

export default Creact;
