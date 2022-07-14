import { Component, OnInit } from '@angular/core';

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'ti-panel', class: '' },
    { path: 'profile', title: 'User Profile',  icon:'ti-user', class: '' },
    { path: 'joblist', title: 'Matching Jobs',  icon:'ti-view-list-alt', class: '' },
    { path: 'education', title: 'My Education',  icon:'ti-book', class: '' },
    { path: 'experince', title: 'Experince Details',  icon:'ti-briefcase', class: '' },
    { path: 'mycon', title: 'My Contact',  icon:'ti-envelope', class: '' },
    { path: 'notifications', title: 'Notifications',  icon:'ti-bell', class: '' },
    { path: 'accountsetting', title: 'Change Password',  icon:'ti-lock', class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

}
