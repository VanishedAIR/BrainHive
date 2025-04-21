document.body.innerHTML = `
    <nav>
        <a href="#home">Home</a>
        <a href="#signin">Sign In</a>
    </nav>
    <div id="content"></div>
`;

/**
 * Handles hash-based routing for the Study Group Finder application.
 * Dynamically updates the content of the page based on the current URL hash.
 *
 * Routes:
 * - `#home`: Displays the homepage.
 * - `#signin`: Displays the sign-in page.
 * - `#post`: Displays the start page.
 */
class Router {
    /**
     * @param {Object} routes - An object mapping route names to functions that return HTML content.
     */
    constructor(routes) {
        this.routes = routes;
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        this.handleRouteChange();
    }

    /**
     * Handles changes to the URL hash and updates the page content.
     */
    handleRouteChange() {
        const hash = window.location.hash.slice(1);
        const route = this.routes[hash];
        document.querySelector('#content').innerHTML = route ? route() : '404 not found';
    }
}

const routes = {
    home: () => '<h1>Welcome to the Homepage</h1>',
    signin: () => '<h1>Sign In Page</h1>'
};

const router = new Router(routes);

