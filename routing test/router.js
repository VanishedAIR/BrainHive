document.body.innerHTML = `
    <nav>
        <a href="#home">Home</a>
        <a href="#signin">Sign In</a>
    </nav>
    <div id="content"></div>
`;

class Router {
    constructor(routes) {
        this.routes = routes;
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1);
        console.log(hash);
        const route = this.routes[hash];
        if (route) {
            document.querySelector('#content').innerHTML = route();
        }
        else {
            document.querySelector('#content').innerHTML = '404 not found';
        }
    }
}

const routes = {
    home: () => '<h1>Welcome to the Homepage</h1>',
    signin: () => '<h1>Sign In Page</h1>'
};

const router = new Router(routes);

