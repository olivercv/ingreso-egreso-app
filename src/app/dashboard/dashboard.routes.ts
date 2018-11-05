import { Routes } from "@angular/router";
import { EstaditicaComponent } from "../ingreso-egreso/estaditica/estaditica.component";
import { IngresoEgresoComponent } from "../ingreso-egreso/ingreso-egreso.component";
import { DetalleComponent } from "../ingreso-egreso/detalle/detalle.component";



export const dashboardRoutes: Routes = [
    {path: '',component:EstaditicaComponent},
    {path: 'ingreso-egreso',component:IngresoEgresoComponent},
    {path: 'detalle',component:DetalleComponent}
]