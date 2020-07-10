import * as React from "react";
import * as ReactDOM from "react-dom";

export const inject = (Component, props, element) => {
  ReactDOM.render(<Component {...props} />, element);
};
