import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
	{ path: 'page', component: PageComponent },
	{ path: '**', component: HomepageComponent },
];
