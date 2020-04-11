import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListsComponent } from "./member/member-lists/member-lists.component";
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './member/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '', runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard], children: [

            { path: 'messages', component: MessagesComponent},
            { path: 'members', component: MemberListsComponent,resolve: {users : MemberListResolver}},
            { path: 'members/:id', component: MemberDetailComponent,resolve: {user: MemberDetailResolver}},
            { path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver},
                    canDeactivate:[PreventUnsavedChanges]},
            { path: 'lists', component: ListsComponent}
        ]
    },    
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
