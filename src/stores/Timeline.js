import { observable, action, decorate } from "mobx";
import { formatMedia } from "util/feed";
import uniqBy from "lodash/uniqBy";

class Timeline {
    posts = [];
    loading = false;

    constructor() {
        window.ipcRenderer.on("feed", (e, feed) => {
            const formatted = formatMedia(feed);
            this.posts = uniqBy(formatted, "id");
            this.loading = false;
        });

        setInterval(() => {
            window.ipcRenderer.send("get-feed", true);
            this.loading = true;
        }, 3 * 60 * 1000);
    }

    getPosts = () => {
        if (!this.loading) {
            window.ipcRenderer.send("get-feed");
            this.loading = true;
        }
    };

    setLoading = () => {
        this.loading = true;
    };
}

const decorated = decorate(Timeline, {
    posts: observable,
    loading: observable,
    setLoading: action,
    getPosts: action
});

export default decorated;
