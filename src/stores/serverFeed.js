const { combineReducers } = require("redux");
const uniqBy = require("lodash/uniqBy");

const addFeed = ({ posts, isAppend = false }) => ({
    type: "ADD_FEED",
    posts,
    isAppend
});

const timeline = (state = [], action) => {
    switch (action.type) {
        case "ADD_FEED":
            if (action.isAppend) {
                return uniqBy([...action.posts, ...state], "id");
            } else {
                return uniqBy([...state, ...action.posts], "id");
            }
        default:
            return state;
    }
};

module.exports = {
    feedReducer: combineReducers({ timeline }),
    addFeed
};
