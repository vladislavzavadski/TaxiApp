const setCurrentDriverAction = (currentDriver) => {
    return {
        type: 'CURRENT_DRIVER',
        payload: currentDriver,
    }
};

export const setCurrentDriver = currentDriver => dispatch => {
    dispatch(setCurrentDriverAction(currentDriver));
}

const setDriversAction = (drivers) => {
    return {
        type: 'DRIVERS',
        payload: drivers,
    }
};

export const setDrivers = drivers => dispatch => {
    dispatch(setDriversAction(drivers));
}

const addCommentAction = (comment) => {
    return {
        type: 'ADD_COMMENT',
        payload: comment,
    }
};

export const addComment = comment => dispatch => {
    dispatch(addCommentAction(comment));
}

const setRouteInfoAction = (routeInfo) => {
    return {
        type: 'ROUTE',
        payload: routeInfo,
    }
};

export const setRouteInfo = routeInfo => dispatch => {
    dispatch(setRouteInfoAction(routeInfo));
}
