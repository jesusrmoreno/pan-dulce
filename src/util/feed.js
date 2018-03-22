import get from 'lodash/get';

export const formatMedia = posts => {
    return posts.map(post => {
        const carousel = get(post, "carouselMedia", []).map(c => {
            return c.images[0];
        });
        return {
            ...post,
            source: carousel.length ? carousel : [post.images[0]]
        };
    });
};
