document.body.innerHTML = `
    <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
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
            document.querySelector('#content').innerHTML = route.template;
        }
        else {
            document.querySelector('#content').innerHTML = '404 not found';
        }
    }
}

const routes = {
    home:() => '<h1>Home</h1>',
    about:() => '<h1>About</h1>',
    contact:() => '<h1>Contact</h1>'
};

const router = new Router(routes);

// router.handleRouteChange(); // should display the home page
// window.location.hash = '#about'; // should display the about page
// window.location.hash = '#contact'; // should display the contact page
// window.location.hash = '#home'; // should display the home page
// window.location.hash = '#'; // should display the 404 page

