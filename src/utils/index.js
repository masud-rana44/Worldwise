import { v4 as uuidv4 } from "uuid";

const generateUniqueId = () => {
  return uuidv4();
};

export { generateUniqueId };
