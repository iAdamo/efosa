import { v4 as uuidv4 } from "uuid";

const groupUrls = (endpoints, direction) => {
  const newObj = {
    name: "Main",
    type: direction === "SOURCE" ? "get" : "post",
    direction,
    children: [],
    final: false,
    id: uuidv4(),
  };
  const result = newObj.children;

  endpoints.map((endpoint, index) => {
    let item = endpoint;
    const split = [];
    let currentItem;
    //checks if first letter is a slash, if so, remove it
    if (item[0] === "/") {
      item = item.slice(1);
    }

    //splits the item by the slash
    const splitArr = item.split("/");

    //used to check if there are any empty strings in the split arrays
    for (let i = 0; i < splitArr.length; i++) {
      if (splitArr[i].length === 0) {
        if (i !== 0) {
          splitArr[i - 1] = `${splitArr[i - 1]}/`;
        }
      } else {
        split.push(splitArr[i]);
      }
    }
    let newUrl = '/';
    for (let i = 0; i < split.length; i++) {
      newUrl += i === 0 ? split[i] : `/${split[i]}`;
      if (i === 0) {
        let foundIndex = -1;
        //checks if current item already exists in the result array
        if (result.length > 0) {
          result.findIndex((item, index) => {
            if (item.final === false && item.name === split[i]) {
              foundIndex = index;
              return;
            }
          });
        }

        if (foundIndex !== -1) {
          //if the item already exists, set the current item to that item
          currentItem = result[foundIndex];
        } else {
          //if the item does not exist, create a new object and push it to the result array
          const newObj = {
            name: split[0],
            type: direction === "SOURCE" ? "get" : "post",
            direction,
            children: [],
            final: false,
            fullUrl: newUrl,
            id: uuidv4(),
          };

          if (i === split.length - 1) {
            newObj.final = true;
          }
          result.push(newObj);
          currentItem = newObj;
        }
      } else {
        let foundIndex = -1;
        //checks if current item already exists in the children array
        if (currentItem.children.length > 0) {
          currentItem.children.findIndex((item, index) => {
            if (item.final === false && item.name === split[i]) {
              foundIndex = index;
              return;
            }
          });
        }

        if (foundIndex === -1) {
          //if the item does not exist, create a new object and push it to the children array
          const obj = {
            name: split[i],
            type: direction === "SOURCE" ? "get" : "post",
            direction,
            children: [],
            final: i === split.length - 1,
            fullUrl: newUrl,
            id: uuidv4(),
          };
          currentItem.children.push(obj);
          currentItem = currentItem.children[currentItem.children.length - 1];
        } else {
          //if the item already exists, set the current item to that item
          currentItem = currentItem.children[foundIndex];
        }
      }
    }
  });

  return newObj;
};

export default groupUrls;
