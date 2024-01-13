import { CreactNode, render } from "./Creact";

const CreactDOM = {
  createRoot(container: HTMLElement) {
    return {
      render(app: CreactNode) {
        render(app, container);
      },
    };
  },
};

export default CreactDOM;
