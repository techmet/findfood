// Return an exception that includes an error code
export const error = (message, code) => {
    const e = new Error(message);
    e.code = code;
    return e;
  };
  