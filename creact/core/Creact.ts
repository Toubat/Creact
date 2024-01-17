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

export enum EffectTags {
  Placement = "PLACEMENT",
  Update = "UPDATE",
  Deletion = "DELETION",
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
  alternate?: FiberNode;
  effectTag: EffectTags;
};

let wipRoot: FiberNode | undefined = undefined;
let currRoot: FiberNode | undefined = undefined;
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

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  if (wipRoot?.alternate) {
    // debugger;
  }

  commitWork(wipRoot!.child!);
  currRoot = wipRoot;
  wipRoot = undefined;
}

function commitWork(fiber: FiberNode | undefined) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (fiberParent && !fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === EffectTags.Placement) {
    fiber.dom && (fiberParent!.dom as HTMLElement).append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type: string) {
  return type === NodeTypes.Text ? document.createTextNode("") : document.createElement(type);
}

function updateProps(
  dom: HTMLElement | Text,
  nextProps: CreactProps,
  prevProps: CreactProps | undefined
) {
  prevProps = prevProps || { children: [] };

  // delete old props
  Object.keys(prevProps).forEach((key) => {
    if (key === "children") return;
    if (key in nextProps) return;

    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      dom.removeEventListener(eventType, prevProps![key]);
    } else {
      (dom as HTMLElement).removeAttribute(key);
    }
  });

  // upsert new props
  Object.keys(nextProps).forEach((key) => {
    if (key === "children") return;
    if (prevProps![key] === nextProps[key]) return;

    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      dom.removeEventListener(eventType, prevProps![key]);
      dom.addEventListener(eventType, nextProps[key]);
    } else {
      dom[key] = nextProps[key];
    }
  });
}

function reconcileChildren(fiber: FiberNode, children: CreactNode[]) {
  let prevFiber: FiberNode | undefined = fiber.alternate?.child;
  let prevUnitOfWork: FiberNode | undefined = undefined;

  children.forEach((child, idx) => {
    let unitOfWork: FiberNode;

    if (prevFiber && prevFiber.type === child.type) {
      // tag is the same, reuse old dom
      unitOfWork = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: prevFiber.dom,
        alternate: prevFiber,
        effectTag: EffectTags.Update,
      };
    } else {
      // tag is different, create new dom
      unitOfWork = {
        type: child.type,
        props: child.props,
        parent: fiber,
        effectTag: EffectTags.Placement,
      };
    }

    if (idx === 0) {
      fiber.child = unitOfWork;
    } else {
      prevUnitOfWork!.sibling = unitOfWork;
    }

    if (idx === children.length - 1) {
      unitOfWork.uncle = fiber.sibling || fiber.uncle;
    }

    prevUnitOfWork = unitOfWork;
    prevFiber = prevFiber?.sibling;
  });
}

function updateFunctionComponent(fiber: FiberNode) {
  const children = [(fiber.type as FC)(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: FiberNode) {
  const dom = (fiber.dom = fiber.dom || createDom(fiber.type as string));
  updateProps(dom, fiber.props, fiber.alternate?.props);
  reconcileChildren(fiber, fiber.props.children);
}

function performUnitOfWork(fiber: FiberNode): FiberNode | undefined {
  if (fiber.alternate) {
    // debugger;
  }

  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  return fiber.child || fiber.sibling || fiber.uncle;
}

function submitRootWork(fiber: FiberNode) {
  wipRoot = fiber;
  nextUnitOfWork = wipRoot;
}

export function render(el: CreactNode, container: HTMLElement) {
  submitRootWork({
    type: "",
    props: {
      children: [el],
    },
    dom: container,
    effectTag: EffectTags.Placement,
  });
}

export function update() {
  if (!currRoot) {
    throw new Error("Root is not initialized");
  }

  submitRootWork({
    type: currRoot.type,
    props: currRoot.props,
    dom: currRoot.dom,
    alternate: currRoot,
    effectTag: EffectTags.Update,
  });
}

requestIdleCallback(workLoop);

const Creact = {
  render,
  update,
  createElement,
};

export default Creact;
