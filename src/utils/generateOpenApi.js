import { createMyAPIs, updateMyApi } from "@axios/apiCalls";

const infoOpenApi = (item) => {
    const { name, description, version } = item;
    const info = {
        title: name,
        description,
        version,
    };
    return info;
};

const securityOpenApi = (item) => {
    const { security } = item;
    const securityDefinitions = {};
    if (security?.length > 1) {
        securityDefinitions[security] = { type: "basic" };
    }

    return securityDefinitions;
};

const pathOpenApi = (item) => {
    const { builder } = item;
    const result = {};

    builder.map((builderItem) => {
        if (!result[builderItem.endpoint]) {
            result[builderItem.endpoint] = builderItemOpenApi(
                builderItem,
                item
            );
        } else {
            result[builderItem.endpoint] = {
                ...builderItemOpenApi(builderItem, item),
                ...result[builderItem.endpoint],
            };
        }
    });
    return result;
};

const builderItemOpenApi = (builderItem, item) => {
    const builderItems = {};

    builderItems[builderItem.method] = {
        description: builderItem.description,
        producer: [builderItem.contentType],
        responses: responseOpenApi(item, builderItem),
    };
    return builderItems;
};

const responseOpenApi = (item, builderItem) => {
    const { response } = item;
    const result = {};
    const filterParams = builderItem.parameters.filter(
        (param) => param.name.length > 0
    );
    response.map((res) => {
        result[res.code] = {
            description: res.description,
            schema: {
                type: "object",
                items: {
                    parameters: filterParams,
                },
            },
        };
    });
    return result;
};

export const generateOpenApi = async (item, id) => {
    const { server, userId } = item;
    const data = {
        info: infoOpenApi(item),
        host: server,
        securityDefinitions: securityOpenApi(item),
        paths: pathOpenApi(item),
    };

    const sendData = {
        name: item.name,
        json: JSON.stringify(data),
    };
    if (id) {
        await updateMyApi(sendData, userId, id);
    } else {
        await createMyAPIs(sendData, userId);
    }
};
