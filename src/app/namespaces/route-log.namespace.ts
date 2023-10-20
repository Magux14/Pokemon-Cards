export namespace ROUTE_LOG {

    const routelogKey: string = 'route-log';

    export function addRoute(route: string) {
        const lstRoutes: string[] = getRoutes();
        lstRoutes.push(route);
        localStorage.setItem(routelogKey, JSON.stringify(lstRoutes));
    }

    export function getRoutes(): string[] {
        const lstRoutes: string[] = JSON.parse(localStorage.getItem(routelogKey)) || [];
        return lstRoutes;
    }

    export function cleanRoutes() {
        localStorage.removeItem(routelogKey);
    }

}