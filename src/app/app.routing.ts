import { Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { TableComponent }   from './table/table.component';
import { TypographyComponent }   from './typography/typography.component';
import { IconsComponent }   from './icons/icons.component';
import { NotificationsComponent }   from './notifications/notifications.component';
import { UpgradeComponent }   from './upgrade/upgrade.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'profile',
        component: UserComponent
    },
    {
        path: 'joblist',
        component: TableComponent
    },
    {
        path: 'education',
        component: TypographyComponent
    },
    {
        path: 'experince',
        component: IconsComponent
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'accountsetting',
        component: UpgradeComponent
    }
]
