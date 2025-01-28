let lastId = 0;

const createComponentId = (prefix = "id") => {
    lastId++;
    return `${prefix}${lastId}`;
};

export default createComponentId;
