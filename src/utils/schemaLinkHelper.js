export const getDestinationLinkId = (schemaLink) => {
    if (schemaLink.fielddestinationID) {
        return `${schemaLink.fielddestinationID}`;
    }
    if (schemaLink.ONdestinationID) {
        return `${schemaLink.id}${schemaLink.ONdestinationID}`;
    }
    return null;
};

export const isONtaleVisible = (target, areaDetails) => {
    if (!target || !areaDetails) return true;
    const targetRect = target.getBoundingClientRect();
    return (
        targetRect.left < areaDetails.left + areaDetails.width &&
        targetRect.left > areaDetails.left
    );
};
