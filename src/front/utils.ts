const token = new URLSearchParams(window.location.search).get("token");

export function _fetch(url: string, postData = {}) {
    const query: RequestInit = {
        headers: {
            authorization: token
        },
    };

    if (Object.keys(postData).length > 0) {
        query.body = JSON.stringify(postData);
        query.method = "POST";
        query.headers["Content-Type"] = "application/json";
    }

    return fetch("/api/" + url, query);
}