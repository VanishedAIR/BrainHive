document.body.innerHTML = `
    <nav>
        <a href="#home">Home</a>
        <a href="#signin">Sign In</a>
        <a href="#post">Start Page</a> <!-- Add link to the post route -->
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
    signin: () => '<h1>Sign In Page</h1>',
    post: () => '<h1>Welcome to the Start Page</h1>' // Define the post route here
};

const router = new Router(routes);

